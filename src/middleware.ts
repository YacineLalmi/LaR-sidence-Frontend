import { NextRequest, NextResponse } from "next/server";
import { getCookie } from "./lib/utils";

const protectedRoutes = ["/tableau-de-bord"];
const publicRoutes = ["/seconnecter"];
let count = 0;
export default async function middleware(req: NextRequest) {
  console.log("running middleware", count++);
  console.log("requesting", req.url);
  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.includes(path);
  const isPublicRoute = publicRoutes.includes(path);

  // const access_token = cookieStore.get("access_token")?.value;
  const access_token = await getCookie("access_token");

  if (!access_token) {
    // Has no access token and no refresh token: redirect user to login page
    return isProtectedRoute || path === "/" ? NextResponse.redirect(new URL("/seconnecter", req.nextUrl)) : NextResponse.next();
  } else {
    // Has an access token and trying to access a public route: redirect the user to the dashboard
    if (isPublicRoute) return NextResponse.redirect(new URL("/tableau-de-bord", req.nextUrl));

    if (path === "/") return NextResponse.redirect(new URL("/tableau-de-bord", req.nextUrl));

    // Everything is OK
    return NextResponse.next();
  }
}

// Routes Middleware should not run on
export const config = {
  matcher: ["/((?!api|_next/static|ERROR|_next/image|.*\\.png$).*)"],
};

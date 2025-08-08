import { NextRequest, NextResponse } from "next/server";
import { getCookie, setCookie } from "./lib/utils";
import { authService } from "./services/auth.service";
import { differenceInSeconds } from "date-fns";

const protectedRoutes = ["/dashboard"];
const publicRoutes = ["/login"];
let count = 0;

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.includes(path);
  const isPublicRoute = publicRoutes.includes(path);

  // const access_token = cookieStore.get("access_token")?.value;
  const access_token = await getCookie("access_token");

  if (!access_token) {
    // Has no access token
    const refresh_token = await getCookie("refresh_token");
    if (!refresh_token) {
      // Has no access token and no refresh token: redirect user to login page
      return isProtectedRoute || path === "/"
        ? NextResponse.redirect(new URL("/login", req.nextUrl))
        : NextResponse.next();
    } else {
      // Has a refresh token: trying to get a new access token and refresh token
      try {
        console.log("refresh_token", refresh_token);
        const responseData = await authService.refresh(refresh_token);

        await setCookie({
          key: "access_token",
          value: responseData.access_token,
          expires: differenceInSeconds(responseData.access_token_expires_at, new Date()),
          maxAge: differenceInSeconds(responseData.access_token_expires_at, new Date()),
        });

        await setCookie({
          key: "refresh_token",
          value: responseData.refresh_token,
          expires: differenceInSeconds(responseData.refresh_token_expires_at, new Date()),
          maxAge: differenceInSeconds(responseData.refresh_token_expires_at, new Date()),
        });
        return NextResponse.next();
      } catch (error) {
        // Generating to access token and refresh token went wrong: show an error page
        return NextResponse.redirect(new URL("/ERROR", req.nextUrl));
      }
    }
  } else {
    // Has an access token and trying to access a public route: redirect the user to the dashboard
    if (isPublicRoute) return NextResponse.redirect(new URL("/dashboard", req.nextUrl));

    if (path === "/") return NextResponse.redirect(new URL("/dashboard", req.nextUrl));

    // Everything is OK
    return NextResponse.next();
  }
}

// Routes Middleware should not run on
export const config = {
  matcher: ["/((?!api|_next/static|ERROR|_next/image|.*\\.png$).*)"],
};

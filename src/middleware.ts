import { NextRequest, NextResponse } from "next/server";
import { clearCookies, getCookie, refreshTokens, removeCookie, setCookie } from "./lib/server.helper";
import { UserService } from "./services/user.service";
import { addHours } from "date-fns";
import { Profile } from "./schemas/users/profile.schema";

const adminRoutes = ["/dashboard", "/settings/users", "/settings", "/"];
const agentRoutes = ["/dashboard", "/"];
const protectedRoutes = new Set([...adminRoutes, ...agentRoutes]);
const publicRoutes = ["/login"];

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isAdminRoute = adminRoutes.includes(path);
  const isAgentRoute = agentRoutes.includes(path);
  const isProtectedRoute = protectedRoutes.has(path);
  const isPublicRoute = publicRoutes.includes(path);

  let access_token: string | null = null;
  try {
    access_token = await getCookie("access_token");
  } catch (error) {
    // If decryption fails (e.g., old cookies with wrong key), clear all cookies
    console.error("Failed to decrypt access_token, clearing cookies:", error);
    await removeCookie("access_token");
    await removeCookie("refresh_token");
    await removeCookie("eo_rmnsutoifirna");
  }

  if (!access_token) {
    if (isProtectedRoute) {
      try {
        await refreshTokens();
      } catch (error) {
        await removeCookie("access_token");
        await removeCookie("refresh_token");
        await removeCookie("eo_rmnsutoifirna");
        return NextResponse.redirect(new URL("/login", req.nextUrl));
      }
    } else return NextResponse.next();
  } else {
    try {
      const encoded_user_information = await getCookie("eo_rmnsutoifirna");
      if (!encoded_user_information) {
        // const user_information = await UserService.profile();
        // await setCookie({
        //   key: "eo_rmnsutoifirna",
        //   value: JSON.stringify(user_information),
        //   expires: addHours(new Date(), 1),
        //   maxAge: 60 * 60,
        // });
      }
    } catch (error) {
      // If decryption fails, clear the cookie and continue
      console.error("Failed to decrypt user information:", error);
      await removeCookie("eo_rmnsutoifirna");
    }

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

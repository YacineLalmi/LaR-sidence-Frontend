import { NextRequest, NextResponse } from "next/server";
import { clearCookies, getCookie, removeCookie, setCookie } from "./lib/server.helper";
import { checkRoutePermission, isPublicRoute } from "./lib/utiles/route.utile";
import { COOKIES_KEYS } from "./constants/cookies-keys";
import { refreshTokenAction } from "./actions/authentication/refresh.action";
import { getProfilePermissionsAction } from "./actions/Profile/get-profile-permissions.action";

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  console.log("-----------------")
  console.log("one");
  // Handle public routes
  if (isPublicRoute(path)) {
    console.log("two");
    const access_token = await getCookie("access_token").catch(() => null);
    // If logged in, redirect away from public routes (like /login)
    if (access_token) {
      console.log("three");
      return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
    }
    return NextResponse.next();
  }
  console.log("four");
  // ========== AUTHENTICATION CHECK ==========

  const access_token = await getCookie(COOKIES_KEYS.ACCESS_TOKEN);

  // If no access token, try to refresh
  if (!access_token) {
    console.log("five");
    // Check if refresh token exists
    const refresh_token = await getCookie(COOKIES_KEYS.REFRESH_TOKEN);
    console.log("six");
    // No refresh token - clear everything and redirect to login
    if (!refresh_token) {
      console.log("seven");
      await clearCookies();
      return NextResponse.redirect(new URL("/login", req.nextUrl));
    }

    // Try to refresh the token
    try {
      const refreshResult = await refreshTokenAction(refresh_token);

      if (!refreshResult.isOk) {
        throw new Error("Token refresh failed");
      }
    } catch (error) {
      console.error("Failed to refresh token:", error);
      await clearCookies();
      return NextResponse.redirect(new URL("/login", req.nextUrl));
    }
  }
  console.log("eight");
  // ========== PERMISSION CHECK ==========
  try {
    const permissions = await getProfilePermissionsAction();
     console.log("nine")
    // Check if user has permission to access this route
    const hasPermission = checkRoutePermission(path, permissions);
     console.log("ten")
    if (!hasPermission) {
      console.log("eleven")
      // Redirect to forbidden page or first allowed route
      return NextResponse.redirect(new URL("/forbidden", req.nextUrl));
    }
    console.log("tweleve")
    // All checks passed - allow access
    return NextResponse.next();
  } catch {
    console.log("therteen")
    await clearCookies();
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon\\.ico|.*\\.png$|.*\\.json$).*)"],
};

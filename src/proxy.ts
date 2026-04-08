import { NextRequest, NextResponse } from "next/server";
import { clearCookies, getCookie } from "./lib/server.helper";
import { checkRoutePermission, isPublicRoute } from "./lib/utiles/route.utile";
import { COOKIES_KEYS } from "./constants/cookies-keys";
import { refreshTokenAction } from "./actions/authentication/refresh.action";
import { getProfilePermissionsAction } from "./actions/Profile/get-profile-permissions.action";
import { ROUTES } from "./constants/routes";

export default async function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname;

  console.log("Requseted PAth", path)

  if (isPublicRoute(path)) {
    const access_token = await getCookie(COOKIES_KEYS.ACCESS_TOKEN).catch(() => null);
    if (access_token) {
      return NextResponse.redirect(new URL(ROUTES.DASHBOARD, req.nextUrl));
    }
    return NextResponse.next();
  }

  const access_token = await getCookie(COOKIES_KEYS.ACCESS_TOKEN);

  if (!access_token) {

    const refresh_token = await getCookie(COOKIES_KEYS.REFRESH_TOKEN);

    if (!refresh_token) {
      await clearCookies();
      return NextResponse.redirect(new URL(ROUTES.AUTH.LOGIN, req.nextUrl));
    }
    try {
      const refreshResult = await refreshTokenAction(refresh_token);

      if (!refreshResult.isOk) {
        throw new Error("Token refresh failed");
      }
    } catch (error) {
      console.error("Failed to refresh token:", error);
      await clearCookies();
      return NextResponse.redirect(new URL(ROUTES.AUTH.LOGIN, req.nextUrl));
    }
  }

  try {
    const permissions = await getProfilePermissionsAction();
    const hasPermission = checkRoutePermission(path, permissions);
    if (!hasPermission) {
      return NextResponse.redirect(new URL("/forbidden", req.nextUrl));
    }
    return NextResponse.next();
  } catch {
    await clearCookies();
    return NextResponse.redirect(new URL(ROUTES.AUTH.LOGIN, req.nextUrl));
  }

}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon\\.ico|.*\\.png$|.*\\.json$).*)"],
};

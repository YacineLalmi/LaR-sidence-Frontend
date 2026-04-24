import { NextRequest, NextResponse } from "next/server";
import { clearCookies, getCookie } from "./lib/server.helper";
import { checkRoutePermission, isPublicRoute } from "./lib/utiles/route.utile";
import { COOKIES_KEYS } from "./constants/cookies-keys";
import { refreshTokenAction } from "./actions/authentication/refresh.action";
import { getProfilePermissionsAction } from "./actions/Profile/get-profile-permissions.action";
import { ROUTES } from "./constants/routes";
import { routing } from "./i18n/routing";
import createMiddleware from 'next-intl/middleware';
import { redirect } from "./i18n/navigation";

const intlMiddleware = createMiddleware(routing);

export async function proxy(req: NextRequest) {
  try {
    // First, let i18n middleware handle locale detection and routing
    const intlResponse = intlMiddleware(req);

    const { pathname } = req.nextUrl;


    // ✅ Skip permission check for Server Action POST requests
    if (req.method === 'POST' && req.headers.get('content-type')?.includes('multipart/form-data') === false) {
      // This is a Server Action - trust the page already validated
      return intlResponse;
    }

    if (intlResponse.ok) {
      // Get the pathname with locale


      // Extract locale and path without locale
      const pathSegments = pathname.split('/').filter(Boolean);
      const locale = pathSegments[0] || routing.defaultLocale;
      const pathWithoutLocale = '/' + pathSegments.slice(1).join('/');


      // Protected routes - Check for access token
      let access_token: string | null = null;

      try {
        access_token = await getCookie(COOKIES_KEYS.ACCESS_TOKEN);
      } catch (error) {
        // No access token, allow access to public route
      }



      // Handle public routes
      if (isPublicRoute(pathWithoutLocale)) {
        if (access_token) {
          // User is logged in, redirect to dashboard with locale
          return NextResponse.redirect(new URL(`/${locale}${ROUTES.DASHBOARD}`, req.url));
        }
        return intlResponse;
      }

      if (!access_token) {
        console.debug("no access toke")
        let refresh_token: string | null = null;

        try {
          console.debug("retrieving refresh token")
          refresh_token = await getCookie(COOKIES_KEYS.REFRESH_TOKEN);
        } catch (error) {
          console.error("retrieving refresh token failed")
          refresh_token = null;
        }

        if (!refresh_token) {
          console.debug("no refresh token")
          await clearCookies();
          return NextResponse.redirect(new URL(`/${locale}${ROUTES.AUTH.LOGIN}`, req.url));
        }

        // Attempt to refresh the access token
        try {
          const refreshResult = await refreshTokenAction(refresh_token);

          if (!refreshResult.isOk) {
            await clearCookies();
            console.error("failed refreshing token")
          }

          // Token refreshed successfully, continue with the request
        } catch (error) {
          console.error("Failed to refresh token:", error);
          await clearCookies();
          const loginUrl = new URL(`/${locale}${ROUTES.AUTH.LOGIN}`, req.url);
          return NextResponse.redirect(loginUrl);
        }
      }

      // Check route permissions
      try {
        const permissions = await getProfilePermissionsAction();
        console.log(permissions)
        const hasPermission = checkRoutePermission(pathWithoutLocale, permissions);

        if (!hasPermission) {
          return NextResponse.redirect(new URL(`/${locale}/forbidden`, req.url));
        }

        return intlResponse;

      } catch (error) {
        return NextResponse.redirect(new URL(`/${locale}/forbidden`, req.url));
      }
    }
    return intlResponse;

  } catch (error) {
    console.error("Middleware error:", error);

    // Fallback: redirect to login on any unexpected error
    const pathSegments = req.nextUrl.pathname.split('/').filter(Boolean);
    const locale = pathSegments[0] || routing.defaultLocale;
    const loginUrl = new URL(`/${locale}${ROUTES.AUTH.LOGIN}`, req.url);
    return NextResponse.redirect(loginUrl);
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api routes
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, robots.txt, sitemap.xml
     * - public files (images, etc.)
     */
    "/((?!api|_next/static|_next/image|favicon\\.ico|robots\\.txt|sitemap\\.xml|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$|.*\\.svg$|.*\\.ico$|.*\\.json$).*)",
  ],
};

export default proxy;
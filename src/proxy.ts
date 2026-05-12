import { NextRequest, NextResponse } from "next/server";
import { COOKIES_KEYS } from "./constants/cookies-keys";
import { ROUTES } from "./constants/routes";
import { routing } from "./i18n/routing";
import createMiddleware from 'next-intl/middleware';

const intlMiddleware = createMiddleware(routing);

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 1. Run intlMiddleware first to handle prefixes and locales
  const response = intlMiddleware(req);

  // 2. Identify the locale from the pathname or the response headers
  // next-intl usually attaches the locale to a header
  const locale = response.headers.get('x-next-intl-locale') || routing.defaultLocale;

  // 3. Define Public Routes (Optional but recommended)
  // Prevent redirect loops if the user is already on the login or expired page
  const isPublicRoute = [ROUTES.AUTH.LOGIN, ROUTES.AUTH.RESET_PASSWORD, ROUTES.AUTH.FORGET_PASSWORD, ROUTES.SESSION.EXPIRED].map(route => `/${locale}${route}`).includes(pathname);

  if (isPublicRoute) return response;


  const accessToken = req.cookies.get(COOKIES_KEYS.ACCESS_TOKEN)?.value;
  const refreshToken = req.cookies.get(COOKIES_KEYS.REFRESH_TOKEN)?.value;


  // 4. Auth Logic
  if (!accessToken) {
    // Get the current URL the user was trying to access
    const currentPath = req.nextUrl.pathname + req.nextUrl.search;

    let targetPath = `/${locale}${ROUTES.AUTH.LOGIN}`;
    if (refreshToken) targetPath = `/${locale}${ROUTES.SESSION.EXPIRED}`;


    const url = new URL(targetPath, req.url);
    // Add the current path as a search parameter
    url.searchParams.set("returnTo", currentPath);

    // Create redirect response
    const redirectResponse = NextResponse.redirect(url);

    // 5. IMPORTANT: Sync cookies from intlResponse to your new redirect
    // This ensures locale preferences persist
    response.cookies.getAll().forEach((cookie) => {
      redirectResponse.cookies.set(cookie.name, cookie.value);
    });

    if (!refreshToken) {
      redirectResponse.cookies.delete(COOKIES_KEYS.ACCESS_TOKEN);
      redirectResponse.cookies.delete(COOKIES_KEYS.REFRESH_TOKEN);
    }
    return redirectResponse;
  }
  return response;
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|metadata|favicon\\.ico|robots\\.txt|sitemap\\.xml|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$|.*\\.svg$|.*\\.ico$|.*\\.json$).*)",
  ],
};
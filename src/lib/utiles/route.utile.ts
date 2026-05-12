import { RouteConfig, ROUTES_CONFIG } from "@/config/route.config";
import { arraysIntersect } from "../utils";

export function isPublicRoute(path: string): boolean {
  const route = ROUTES_CONFIG[path]
  if (route) {
    return !route.requireAuthentication;
  }
  return false;
}

function matchDynamicRoute(actualPath: string, routePattern: string): boolean {
  const actualParts = actualPath.split("/").filter(Boolean);
  const patternParts = routePattern.split("/").filter(Boolean);

  if (actualParts.length !== patternParts.length) return false;

  return patternParts.every((part, index) => {
    if (part.startsWith("[") && part.endsWith("]")) return true;
    return part === actualParts[index];
  });
}

export function findMatchingRoute(path: string): RouteConfig | null {
  let route = ROUTES_CONFIG[path]
  if (route) return route;

  const matchedRouteKey = Object.keys(ROUTES_CONFIG).find((key) => matchDynamicRoute(path, key))

  if (matchedRouteKey) return ROUTES_CONFIG[matchedRouteKey]

  return null
}

export function checkRoutePermission(path: string, userPermissions: string[]): boolean {

  const matchedRoute = findMatchingRoute(path);
  // Route not defined - deny access by default for security
  if (!matchedRoute) {
    return false;
  }

  const { permissions: routePermissions } = matchedRoute;

  if (!routePermissions) return true;

  // Protected route - check if user has at least one required permission
  return arraysIntersect(userPermissions, routePermissions);
}

export function getRouteRedirect(userPermissions: string[]): string {
  // Find first matching permission redirect
  // for (const permission of userPermissions) {
  //   if (PERMISSION_REDIRECTS[permission]) {
  //     return PERMISSION_REDIRECTS[permission];
  //   }
  // }

  // Default fallback
  return "/dashboard";
}

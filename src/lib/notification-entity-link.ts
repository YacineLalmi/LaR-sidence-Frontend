import { ROUTES } from "@/constants/routes";

/** In-app link for a notification entity (best-effort by `entity_type`). */
export function notificationEntityHref(
  entityType?: string | null,
  entityId?: string | number | null
): string | null {
  if (!entityType || entityId === null || entityId === undefined || entityId === "") {
    return null;
  }

  switch (entityType) {
    case "Bien":
      return ROUTES.BIENS.DETAIL(entityId);
    case "Demand":
      return ROUTES.DEMANDS.DETAILS(entityId);
    case "Offer":
      return ROUTES.OFFERS.DETAIL(entityId);
    case "Event":
      return ROUTES.EVENTS.DETAIL(entityId);
    case "User":
      return ROUTES.SETTINGS.USERS.DETAIL(entityId);
    case "Visit":
      return ROUTES.OFFERS.ROOT;
    default:
      return null;
  }
}

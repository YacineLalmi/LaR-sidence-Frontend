import { PERMISSIONS } from "@/constants/permissions";
import { ROUTES } from "@/constants/routes";

export type RouteConfig = {
  path: string;
  permissions?: string[];
  requireAuthentication: boolean;
};

export const ROUTES_PERMISSIONS: RouteConfig[] = [

  {
    path: "/forbidden",
    requireAuthentication: true,
  },
  {
    path: "/settings",
    permissions: [
      PERMISSIONS.VIEW_USERS,
      PERMISSIONS.VIEW_BIEN_CHARACTERISTICS,
      PERMISSIONS.VIEW_BIEN_STATUSES,
      PERMISSIONS.VIEW_BIEN_TYPES,
      PERMISSIONS.VIEW_BIEN_PRIORITIES,
      PERMISSIONS.VIEW_CLIENT_TYPES,
      PERMISSIONS.VIEW_CLIENT_STATUSES,
      PERMISSIONS.VIEW_CLIENT_SOURCES,
      PERMISSIONS.VIEW_OFFER_TYPES,
      PERMISSIONS.VIEW_OFFER_STATUSES,
      PERMISSIONS.VIEW_COLORS,
      PERMISSIONS.VIEW_COMMUNES,
      PERMISSIONS.VIEW_WILAYAS,
      PERMISSIONS.VIEW_ROLES,
      PERMISSIONS.VIEW_TRANSACTION_TYPES,
    ],
    requireAuthentication: true,
  },

  // Adjusted
  {
    path: ROUTES.SETTINGS.COLORS.ROOT,
    permissions: [PERMISSIONS.VIEW_COLORS],
    requireAuthentication: true,
  },
  {
    path: ROUTES.SETTINGS.BIENS.TYPES.ROOT,
    permissions: [PERMISSIONS.VIEW_BIEN_TYPES],
    requireAuthentication: true,
  },
  {
    path: ROUTES.SETTINGS.BIENS.STATUSES.ROOT,
    permissions: [PERMISSIONS.VIEW_BIEN_STATUSES],
    requireAuthentication: true,
  },

  {
    path: ROUTES.SETTINGS.BIENS.PRIORITIES.ROOT,
    permissions: [PERMISSIONS.VIEW_BIEN_PRIORITIES],
    requireAuthentication: true,
  },
  {
    path: ROUTES.SETTINGS.BIENS.CHARACTERISTICS.ROOT,
    permissions: [PERMISSIONS.VIEW_BIEN_CHARACTERISTICS],
    requireAuthentication: true,
  }, {
    path: ROUTES.SETTINGS.CLIENTS.STATUSES.ROOT,
    permissions: [PERMISSIONS.VIEW_CLIENT_STATUSES],
    requireAuthentication: true,
  },
  {
    path: ROUTES.SETTINGS.CLIENTS.TYPES.ROOT,
    permissions: [PERMISSIONS.VIEW_CLIENT_TYPES],
    requireAuthentication: true,
  },
  {
    path: ROUTES.SETTINGS.CLIENTS.SOURCES.ROOT,
    permissions: [PERMISSIONS.VIEW_CLIENT_SOURCES],
    requireAuthentication: true,
  },
  {
    path: ROUTES.SETTINGS.LOCATIONS.ROOT,
    permissions: [PERMISSIONS.VIEW_WILAYAS, PERMISSIONS.VIEW_COMMUNES],
    requireAuthentication: true,
  },
  {
    path: ROUTES.SETTINGS.OFFERS.TYPES.ROOT,
    permissions: [PERMISSIONS.VIEW_OFFER_TYPES],
    requireAuthentication: true,
  },
  {
    path: ROUTES.SETTINGS.OFFERS.STATUSES.ROOT,
    permissions: [PERMISSIONS.VIEW_OFFER_STATUSES],
    requireAuthentication: true,
  },
  {
    path: ROUTES.SETTINGS.DEMANDS.STATUSES.ROOT,
    permissions: [PERMISSIONS.VIEW_DEMAND_STATUES],
    requireAuthentication: true,
  },
  {
    path: ROUTES.SETTINGS.DEMANDS.SOURCES.ROOT,
    permissions: [PERMISSIONS.VIEW_DEMAND_SOURCES],
    requireAuthentication: true,
  },
  {
    path: ROUTES.SETTINGS.DEMANDS.TYPES.ROOT,
    permissions: [PERMISSIONS.VIEW_DEMAND_TYPES],
    requireAuthentication: true,
  },
  {
    path: ROUTES.SETTINGS.DEMANDS.PRIORITIES.ROOT,
    permissions: [PERMISSIONS.VIEW_DEMAND_TYPES],
    requireAuthentication: true,
  },
  {
    path: ROUTES.SETTINGS.TRANSACTIONS.TYPES.ROOT,
    permissions: [PERMISSIONS.VIEW_TRANSACTION_TYPES],
    requireAuthentication: true,
  },
  {
    path: ROUTES.SETTINGS.EVENTS.TYPES.ROOT,
    permissions: [PERMISSIONS.VIEW_EVENTS_TYPES],
    requireAuthentication: true,
  },
  {
    path: ROUTES.SETTINGS.ROLES.ROOT,
    permissions: [PERMISSIONS.VIEW_ROLES],
    requireAuthentication: true,
  },
  {
    path: ROUTES.SETTINGS.ROLES.ADD,
    permissions: [PERMISSIONS.MANAGE_ROLES],
    requireAuthentication: true,
  },
  {
    path: ROUTES.SETTINGS.ROLES.EDIT("[id]"),
    permissions: [PERMISSIONS.MANAGE_ROLES],
    requireAuthentication: true,
  },
  {
    path: ROUTES.SETTINGS.USERS.ROOT,
    permissions: [PERMISSIONS.VIEW_USERS],
    requireAuthentication: true,
  },
  {
    path: ROUTES.SETTINGS.USERS.CREATE,
    permissions: [PERMISSIONS.MANAGE_USERS],
    requireAuthentication: true,
  },
  {
    path: ROUTES.SETTINGS.USERS.EDIT("[id]"),
    permissions: [PERMISSIONS.MANAGE_USERS],
    requireAuthentication: true,
  },
  {
    path: ROUTES.AUTH.LOGIN,
    requireAuthentication: false,
  },
  {
    path: ROUTES.AUTH.FORGET_PASSWORD,
    requireAuthentication: false,
  },
  {
    path: ROUTES.AUTH.RESET_PASSWORD,
    requireAuthentication: false,
  },
  {
    path: ROUTES.DASHBOARD,
    requireAuthentication: true,
  },

  {
    path: ROUTES.CLIENTS.ROOT,
    permissions: [PERMISSIONS.VIEW_CLIENTS],
    requireAuthentication: true,
  },
  {
    path: ROUTES.CLIENTS.CREATE,
    permissions: [PERMISSIONS.MANAGE_CLIENTS],
    requireAuthentication: true,
  },
  {
    path: ROUTES.CLIENTS.EDIT("[id]"),
    permissions: [PERMISSIONS.MANAGE_CLIENTS],
    requireAuthentication: true,
  },
  {
    path: ROUTES.OFFERS.ROOT,
    permissions: [PERMISSIONS.VIEW_OFFERS],
    requireAuthentication: true,
  },
  {
    path: ROUTES.OFFERS.CREATE,
    permissions: [PERMISSIONS.MANAGE_OFFERS],
    requireAuthentication: true,
  },
  {
    path: ROUTES.OFFERS.EDIT("[id]"),
    permissions: [PERMISSIONS.MANAGE_OFFERS],
    requireAuthentication: true,
  },

  {
    path: ROUTES.BIENS.ROOT,
    permissions: [PERMISSIONS.VIEW_BIENS],
    requireAuthentication: true,
  },
  {
    path: ROUTES.BIENS.CREATE,
    permissions: [PERMISSIONS.MANAGE_BIENS],
    requireAuthentication: true,
  },
  {
    path: ROUTES.BIENS.EDIT("[id]"),
    permissions: [PERMISSIONS.MANAGE_BIENS],
    requireAuthentication: true,
  },
  {
    path: ROUTES.DEMANDS.ROOT,
    permissions: [PERMISSIONS.VIEW_DEMANDS],
    requireAuthentication: true,
  },
  {
    path: ROUTES.DEMANDS.CREATE,
    permissions: [PERMISSIONS.MANAGE_DEMANDS],
    requireAuthentication: true,
  },
  {
    path: ROUTES.DEMANDS.EDIT('[id]'),
    permissions: [PERMISSIONS.MANAGE_DEMANDS],
    requireAuthentication: true,
  },
  {
    path: ROUTES.EVENTS.ROOT,
    permissions: [PERMISSIONS.VIEW_EVENTS],
    requireAuthentication: true,
  },
  {
    path: ROUTES.EVENTS.CREATE,
    permissions: [PERMISSIONS.MANAGE_EVENTS],
    requireAuthentication: true,
  },
  {
    path: ROUTES.EVENTS.EDIT('[id]'),
    permissions: [PERMISSIONS.MANAGE_EVENTS],
    requireAuthentication: true,
  },
  {
    path: ROUTES.SETTINGS.EVENTS.COLORS.ROOT,
    permissions: [PERMISSIONS.MANAGE_USERS, PERMISSIONS.MANAGE_EVENTS],
    requireAuthentication: true,
  },
];

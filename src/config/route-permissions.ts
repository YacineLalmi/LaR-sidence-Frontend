import { PERMISSIONS } from "@/constants/permissions";

export type RouteConfig = {
  path: string;
  permissions: string[];
  requireAuthentication: boolean;
};

export const ROUTES_PERMISSIONS: RouteConfig[] = [
  {
    path: "/login",
    permissions: [],
    requireAuthentication: false,
  },
  {
    path: "/forbidden",
    permissions: [],
    requireAuthentication: true,
  },
  {
    path: "/dashboard",
    permissions: [],
    requireAuthentication: true,
  },
  {
    path: "/biens",
    permissions: [PERMISSIONS.VIEW_BIENS],
    requireAuthentication: true,
  },
  {
    path: "/biens/add",
    permissions: [PERMISSIONS.CREATE_BIEN],
    requireAuthentication: true,
  },
  {
    path: "/biens/[id]",
    permissions: [PERMISSIONS.UPDATE_BIEN],
    requireAuthentication: true,
  },
  {
    path: "/clients",
    permissions: [PERMISSIONS.VIEW_CLIENTS],
    requireAuthentication: true,
  },
  {
    path: "/clients/add",
    permissions: [PERMISSIONS.CREATE_CLIENT],
    requireAuthentication: true,
  },
  {
    path: "/clients/[id]",
    permissions: [PERMISSIONS.UPDATE_CLIENT],
    requireAuthentication: true,
  },
  {
    path: "/offers",
    permissions: [PERMISSIONS.VIEW_OFFERS],
    requireAuthentication: true,
  },
  {
    path: "/offers/add",
    permissions: [PERMISSIONS.CREATE_OFFER],
    requireAuthentication: true,
  },
  {
    path: "/offers/[id]",
    permissions: [PERMISSIONS.UPDATE_OFFER],
    requireAuthentication: true,
  },
  {
    path: "/demands",
    permissions: [PERMISSIONS.VIEW_DEMANDS],
    requireAuthentication: true,
  },
  {
    path: "/demands/add",
    permissions: [PERMISSIONS.CREATE_DEMAND],
    requireAuthentication: true,
  },
  {
    path: "/demands/[id]",
    permissions: [PERMISSIONS.UPDATE_DEMAND],
    requireAuthentication: true,
  },
  {
    path: "/settings",
    permissions: [
      PERMISSIONS.VIEW_USERS,
      PERMISSIONS.VIEW_BIEN_CHARACTERISTICS,
      PERMISSIONS.VIEW_BIEN_STATUS,
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
];

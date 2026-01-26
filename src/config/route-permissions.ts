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
    path: "/events",
    permissions: [PERMISSIONS.VIEW_EVENTS],
    requireAuthentication: true,
  },
  {
    path: "/events/add",
    permissions: [PERMISSIONS.CREATE_EVENT],
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
  {
    path: "/settings/users",
    permissions: [PERMISSIONS.VIEW_USERS],
    requireAuthentication: true,
  },
  {
    path: "/settings/users/add",
    permissions: [PERMISSIONS.CREATE_USER],
    requireAuthentication: true,
  },
  {
    path: "/settings/users/[id]",
    permissions: [PERMISSIONS.UPDATE_USER],
    requireAuthentication: true,
  },
  {
    path: "/settings/biens",
    permissions: [
      PERMISSIONS.VIEW_BIEN_STATUS,
      PERMISSIONS.VIEW_BIEN_PRIORITIES,
      PERMISSIONS.VIEW_BIEN_CHARACTERISTICS,
      PERMISSIONS.VIEW_BIEN_TYPES,
    ],
    requireAuthentication: true,
  },
  {
    path: "/settings/biens/types",
    permissions: [PERMISSIONS.VIEW_BIEN_TYPES],
    requireAuthentication: true,
  },
  {
    path: "/settings/biens/types/add",
    permissions: [PERMISSIONS.CREATE_BIEN_TYPE],
    requireAuthentication: true,
  },
  {
    path: "/settings/biens/types/[id]",
    permissions: [PERMISSIONS.UPDATE_BIEN_TYPE],
    requireAuthentication: true,
  },
  {
    path: "/settings/biens/status",
    permissions: [PERMISSIONS.VIEW_BIEN_STATUS],
    requireAuthentication: true,
  },
  {
    path: "/settings/biens/status/add",
    permissions: [PERMISSIONS.CREATE_BIEN_STATUS],
    requireAuthentication: true,
  },
  {
    path: "/settings/biens/status/[id]",
    permissions: [PERMISSIONS.UPDATE_BIEN_STATUS],
    requireAuthentication: true,
  },
  {
    path: "/settings/biens/priorities",
    permissions: [PERMISSIONS.VIEW_BIEN_PRIORITIES],
    requireAuthentication: true,
  },
  {
    path: "/settings/biens/priorities/add",
    permissions: [PERMISSIONS.CREATE_BIEN_PRIORITY],
    requireAuthentication: true,
  },
  {
    path: "/settings/biens/priorities/[id]",
    permissions: [PERMISSIONS.UPDATE_BIEN_PRIORITY],
    requireAuthentication: true,
  },
  {
    path: "/settings/biens/characteristics",
    permissions: [PERMISSIONS.VIEW_BIEN_CHARACTERISTICS],
    requireAuthentication: true,
  },
  {
    path: "/settings/biens/characteristics/add",
    permissions: [PERMISSIONS.CREATE_BIEN_CHARACTERISTIC],
    requireAuthentication: true,
  },
  {
    path: "/settings/biens/characteristics/[id]",
    permissions: [PERMISSIONS.UPDATE_BIEN_CHARACTERISTIC],
    requireAuthentication: true,
  },
  {
    path: "/settings/offers",
    permissions: [PERMISSIONS.VIEW_OFFER_STATUSES, PERMISSIONS.VIEW_OFFER_TYPES],
    requireAuthentication: true,
  },
  {
    path: "/settings/offers/types",
    permissions: [PERMISSIONS.VIEW_OFFER_TYPES],
    requireAuthentication: true,
  },
  {
    path: "/settings/offers/types/add",
    permissions: [PERMISSIONS.CREATE_OFFER_TYPE],
    requireAuthentication: true,
  },
  {
    path: "/settings/offers/types/[id]",
    permissions: [PERMISSIONS.UPDATE_OFFER_TYPE],
    requireAuthentication: true,
  },
  {
    path: "/settings/offers/status",
    permissions: [PERMISSIONS.VIEW_OFFER_STATUSES],
    requireAuthentication: true,
  },
  {
    path: "/settings/offers/status/add",
    permissions: [PERMISSIONS.CREATE_OFFER_STATUS],
    requireAuthentication: true,
  },
  {
    path: "/settings/offers/status/[id]",
    permissions: [PERMISSIONS.UPDATE_OFFER_STATUS],
    requireAuthentication: true,
  },
  {
    path: "/settings/roles",
    permissions: [PERMISSIONS.VIEW_ROLES],
    requireAuthentication: true,
  },
  {
    path: "/settings/roles/add",
    permissions: [PERMISSIONS.CREATE_ROLE],
    requireAuthentication: true,
  },
  {
    path: "/settings/roles/[id]",
    permissions: [PERMISSIONS.UPDATE_ROLE],
    requireAuthentication: true,
  },
  {
    path: "/settings/clients",
    permissions: [PERMISSIONS.VIEW_CLIENT_SOURCES, PERMISSIONS.VIEW_CLIENT_STATUSES, PERMISSIONS.VIEW_CLIENT_TYPES],
    requireAuthentication: true,
  },
  {
    path: "/settings/clients/status",
    permissions: [PERMISSIONS.VIEW_CLIENT_STATUSES],
    requireAuthentication: true,
  },
  {
    path: "/settings/clients/status/add",
    permissions: [PERMISSIONS.CREATE_CLIENT_STATUS],
    requireAuthentication: true,
  },
  {
    path: "/settings/clients/status/[id]",
    permissions: [PERMISSIONS.UPDATE_CLIENT_STATUS],
    requireAuthentication: true,
  },
  {
    path: "/settings/clients/types",
    permissions: [PERMISSIONS.VIEW_CLIENT_TYPES],
    requireAuthentication: true,
  },
  {
    path: "/settings/clients/types/add",
    permissions: [PERMISSIONS.CREATE_CLIENT_TYPE],
    requireAuthentication: true,
  },
  {
    path: "/settings/clients/types/[id]",
    permissions: [PERMISSIONS.UPDATE_CLIENT_TYPE],
    requireAuthentication: true,
  },
  {
    path: "/settings/clients/sources",
    permissions: [PERMISSIONS.VIEW_CLIENT_SOURCES],
    requireAuthentication: true,
  },
  {
    path: "/settings/clients/sources/add",
    permissions: [PERMISSIONS.CREATE_CLIENT_SOURCE],
    requireAuthentication: true,
  },
  {
    path: "/settings/clients/sources/[id]",
    permissions: [PERMISSIONS.UPDATE_CLIENT_SOURCE],
    requireAuthentication: true,
  },
  {
    path: "/settings/locations",
    permissions: [PERMISSIONS.VIEW_WILAYAS, PERMISSIONS.VIEW_COMMUNES],
    requireAuthentication: true,
  },
  {
    path: "/settings/transactions",
    permissions: [PERMISSIONS.VIEW_TRANSACTION_TYPES],
    requireAuthentication: true,
  },
  {
    path: "/settings/transactions/types",
    permissions: [PERMISSIONS.VIEW_TRANSACTION_TYPES],
    requireAuthentication: true,
  },
  {
    path: "/settings/transactions/types/add",
    permissions: [PERMISSIONS.CREATE_TRANSACTION_TYPE],
    requireAuthentication: true,
  },
  {
    path: "/settings/transactions/types/[id]",
    permissions: [PERMISSIONS.UPDATE_TRANSACTION_TYPE],
    requireAuthentication: true,
  },
  {
    path: "/settings/colors",
    permissions: [PERMISSIONS.VIEW_COLORS],
    requireAuthentication: true,
  },
];

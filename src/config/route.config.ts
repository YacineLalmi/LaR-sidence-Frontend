import { PERMISSIONS } from "@/constants/permissions";
import { ROUTES } from "@/constants/routes";
import { TRANSLATIONS_KEYS_2 } from "@/i18n/translation-keys";

export type RouteConfig = {
  permissions?: string[];
  requireAuthentication: boolean;
  title: string;
  backLink?: string
};

export const ROUTES_CONFIG: Record<string, RouteConfig> = {
  // --- SETTINGS ---
  [ROUTES.SETTINGS.ROOT]: {
    requireAuthentication: true,
    title: TRANSLATIONS_KEYS_2.SETTINGS.TITLE,
  },
  [ROUTES.SETTINGS.COLORS.ROOT]: {
    permissions: [PERMISSIONS.VIEW_COLORS],
    requireAuthentication: true,
    title: TRANSLATIONS_KEYS_2.SETTINGS.COLORS.TITLE,
    backLink: ROUTES.SETTINGS.ROOT
  },
  [ROUTES.SETTINGS.BIENS.TYPES.ROOT]: {
    permissions: [PERMISSIONS.VIEW_BIEN_TYPES],
    requireAuthentication: true,
    title: TRANSLATIONS_KEYS_2.SETTINGS.BIENS.TYPES.TITLE,
    backLink: ROUTES.SETTINGS.ROOT
  },
  [ROUTES.SETTINGS.BIENS.STATUSES.ROOT]: {
    permissions: [PERMISSIONS.VIEW_BIEN_STATUSES],
    requireAuthentication: true,
    title: TRANSLATIONS_KEYS_2.SETTINGS.BIENS.STATUSES.TITLE,
    backLink: ROUTES.SETTINGS.ROOT
  },
  [ROUTES.SETTINGS.BIENS.PRIORITIES.ROOT]: {
    permissions: [PERMISSIONS.VIEW_BIEN_PRIORITIES],
    requireAuthentication: true,
    title: TRANSLATIONS_KEYS_2.SETTINGS.BIENS.PRIORITIES.TITLE,
    backLink: ROUTES.SETTINGS.ROOT
  },
  [ROUTES.SETTINGS.BIENS.CHARACTERISTICS.ROOT]: {
    permissions: [PERMISSIONS.VIEW_BIEN_CHARACTERISTICS],
    requireAuthentication: true,
    title: TRANSLATIONS_KEYS_2.SETTINGS.BIENS.CHARACTERISTICS.TITLE,
    backLink: ROUTES.SETTINGS.ROOT
  },
  [ROUTES.SETTINGS.CLIENTS.STATUSES.ROOT]: {
    permissions: [PERMISSIONS.VIEW_CLIENT_STATUSES],
    requireAuthentication: true,
    title: TRANSLATIONS_KEYS_2.SETTINGS.CLIENTS.STATUSES.TITLE,
    backLink: ROUTES.SETTINGS.ROOT
  },
  [ROUTES.SETTINGS.CLIENTS.TYPES.ROOT]: {
    permissions: [PERMISSIONS.VIEW_CLIENT_TYPES],
    requireAuthentication: true,
    title: TRANSLATIONS_KEYS_2.SETTINGS.CLIENTS.TYPES.TITLE,
    backLink: ROUTES.SETTINGS.ROOT
  },
  [ROUTES.SETTINGS.CLIENTS.SOURCES.ROOT]: {
    permissions: [PERMISSIONS.VIEW_CLIENT_SOURCES],
    requireAuthentication: true,
    title: TRANSLATIONS_KEYS_2.SETTINGS.CLIENTS.SOURCES.TITLE,
    backLink: ROUTES.SETTINGS.ROOT
  },
  [ROUTES.SETTINGS.LOCATIONS.ROOT]: {
    permissions: [PERMISSIONS.VIEW_WILAYAS, PERMISSIONS.VIEW_COMMUNES],
    requireAuthentication: true,
    title: TRANSLATIONS_KEYS_2.SETTINGS.LOCATIONS.TITLE,
    backLink: ROUTES.SETTINGS.ROOT
  },
  [ROUTES.SETTINGS.OFFERS.TYPES.ROOT]: {
    permissions: [PERMISSIONS.VIEW_OFFER_TYPES],
    requireAuthentication: true,
    title: TRANSLATIONS_KEYS_2.SETTINGS.OFFERS.TYPES.TITLE,
    backLink: ROUTES.SETTINGS.ROOT
  },
  [ROUTES.SETTINGS.OFFERS.STATUSES.ROOT]: {
    permissions: [PERMISSIONS.VIEW_OFFER_STATUSES],
    requireAuthentication: true,
    title: TRANSLATIONS_KEYS_2.SETTINGS.OFFERS.STATUSES.TITLE,
    backLink: ROUTES.SETTINGS.ROOT
  },
  [ROUTES.SETTINGS.DEMANDS.STATUSES.ROOT]: {
    permissions: [PERMISSIONS.VIEW_DEMAND_STATUES],
    requireAuthentication: true,
    title: TRANSLATIONS_KEYS_2.SETTINGS.DEMANDS.STATUSES.TITLE,
    backLink: ROUTES.SETTINGS.ROOT
  },
  [ROUTES.SETTINGS.DEMANDS.SOURCES.ROOT]: {
    permissions: [PERMISSIONS.VIEW_DEMAND_SOURCES],
    requireAuthentication: true,
    title: TRANSLATIONS_KEYS_2.SETTINGS.DEMANDS.SOURCES.TITLE,
    backLink: ROUTES.SETTINGS.ROOT
  },
  [ROUTES.SETTINGS.DEMANDS.TYPES.ROOT]: {
    permissions: [PERMISSIONS.VIEW_DEMAND_TYPES],
    requireAuthentication: true,
    title: TRANSLATIONS_KEYS_2.SETTINGS.DEMANDS.TYPES.TITLE,
    backLink: ROUTES.SETTINGS.ROOT
  },
  [ROUTES.SETTINGS.TRANSACTIONS.TYPES.ROOT]: {
    permissions: [PERMISSIONS.VIEW_TRANSACTION_TYPES],
    requireAuthentication: true,
    title: TRANSLATIONS_KEYS_2.SETTINGS.TRANSACTIONS.TYPES.TITLE,
    backLink: ROUTES.SETTINGS.ROOT
  },
  [ROUTES.SETTINGS.EVENTS.TYPES.ROOT]: {
    permissions: [PERMISSIONS.VIEW_EVENTS_TYPES],
    requireAuthentication: true,
    title: TRANSLATIONS_KEYS_2.SETTINGS.EVENTS.TYPES.TITLE,
    backLink: ROUTES.SETTINGS.ROOT
  },
  [ROUTES.SETTINGS.ROLES.ROOT]: {
    permissions: [PERMISSIONS.VIEW_ROLES],
    requireAuthentication: true,
    title: TRANSLATIONS_KEYS_2.SETTINGS.ROLES.TITLE,
    backLink: ROUTES.SETTINGS.ROOT
  },
  [ROUTES.SETTINGS.USERS.ROOT]: {
    permissions: [PERMISSIONS.VIEW_USERS],
    requireAuthentication: true,
    title: TRANSLATIONS_KEYS_2.SETTINGS.USERS.TITLE,
    backLink: ROUTES.SETTINGS.ROOT
  },

  // --- AUTH ---
  [ROUTES.AUTH.LOGIN]: {
    requireAuthentication: false,
    title: TRANSLATIONS_KEYS_2.AUTH.BUTTONS.LOGIN,
  },
  [ROUTES.AUTH.FORGET_PASSWORD]: {
    requireAuthentication: false,
    title: TRANSLATIONS_KEYS_2.AUTH.FORGOT_YOUR_PASSWORD,
  },

  // --- CORE MODULES ---
  [ROUTES.DASHBOARD]: {
    requireAuthentication: true,
    title: TRANSLATIONS_KEYS_2.SIDEMENU.DASHBOARD,
  },
  [ROUTES.STATISTICS.ROOT]: {
    permissions: [PERMISSIONS.VIEW_STATISTICS],
    requireAuthentication: true,
    title: TRANSLATIONS_KEYS_2.STATISTICS.TITLE,
  },
  [ROUTES.PROFILE.ROOT]: {
    requireAuthentication: true,
    title: TRANSLATIONS_KEYS_2.SETTINGS.PROFILE.TITLE,
  },
  [ROUTES.CLIENTS.ROOT]: {
    permissions: [PERMISSIONS.VIEW_CLIENTS],
    requireAuthentication: true,
    title: TRANSLATIONS_KEYS_2.CLIENTS.TITLE,
  },
  [ROUTES.CLIENTS.CREATE]: {
    permissions: [PERMISSIONS.MANAGE_CLIENTS],
    requireAuthentication: true,
    title: TRANSLATIONS_KEYS_2.CLIENTS.FORM.TITLES.CREATE,
    backLink: ROUTES.CLIENTS.ROOT
  },
  [ROUTES.CLIENTS.EDIT("[id]")]: {
    permissions: [PERMISSIONS.MANAGE_CLIENTS],
    requireAuthentication: true,
    title: TRANSLATIONS_KEYS_2.CLIENTS.FORM.TITLES.UPDATE,
    backLink: ROUTES.CLIENTS.ROOT
  },
  [ROUTES.OFFERS.ROOT]: {
    permissions: [PERMISSIONS.VIEW_OFFERS],
    requireAuthentication: true,
    title: TRANSLATIONS_KEYS_2.OFFERS.TITLE,
  },
  [ROUTES.OFFERS.CREATE]: {
    permissions: [PERMISSIONS.MANAGE_OFFERS],
    requireAuthentication: true,
    title: TRANSLATIONS_KEYS_2.OFFERS.FORM.TITLES.CREATE,
    backLink: ROUTES.OFFERS.ROOT
  },
  [ROUTES.OFFERS.EDIT("[id]")]: {
    permissions: [PERMISSIONS.MANAGE_OFFERS],
    requireAuthentication: true,
    title: TRANSLATIONS_KEYS_2.OFFERS.FORM.TITLES.UPDATE,
    backLink: ROUTES.OFFERS.ROOT
  },
  [ROUTES.BIENS.ROOT]: {
    permissions: [PERMISSIONS.VIEW_BIENS],
    requireAuthentication: true,
    title: TRANSLATIONS_KEYS_2.BIENS.TITLE,
  },
  [ROUTES.BIENS.CREATE]: {
    permissions: [PERMISSIONS.MANAGE_BIENS],
    requireAuthentication: true,
    title: TRANSLATIONS_KEYS_2.BIENS.FORM.TITLES.CREATE,
    backLink: ROUTES.BIENS.ROOT
  },
  [ROUTES.BIENS.EDIT("[id]")]: {
    permissions: [PERMISSIONS.MANAGE_BIENS],
    requireAuthentication: true,
    title: TRANSLATIONS_KEYS_2.BIENS.FORM.TITLES.UPDATE,
    backLink: ROUTES.BIENS.ROOT
  },
  [ROUTES.BILLS.ROOT]: {
    permissions: [PERMISSIONS.VIEW_BILLS],
    requireAuthentication: true,
    title: TRANSLATIONS_KEYS_2.BILLS.TITLE,
  },
  [ROUTES.BILLS.EDIT("[id]")]: {
    permissions: [PERMISSIONS.MANAGE_BILLS],
    requireAuthentication: true,
    title: TRANSLATIONS_KEYS_2.BILLS.FORM.TITLES.UPDATE,
    backLink: ROUTES.BILLS.ROOT
  },
  [ROUTES.BILLS.CREATE]: {
    permissions: [PERMISSIONS.MANAGE_BILLS],
    requireAuthentication: true,
    title: TRANSLATIONS_KEYS_2.BILLS.FORM.TITLES.CREATE,
    backLink: ROUTES.BILLS.ROOT
  },
  [ROUTES.DEMANDS.ROOT]: {
    permissions: [PERMISSIONS.VIEW_DEMANDS],
    requireAuthentication: true,
    title: TRANSLATIONS_KEYS_2.DEMANDS.TITLE,
  },
  [ROUTES.DEMANDS.CREATE]: {
    permissions: [PERMISSIONS.MANAGE_DEMANDS],
    requireAuthentication: true,
    title: TRANSLATIONS_KEYS_2.DEMANDS.FORM.TITLES.CREATE,
    backLink: ROUTES.DEMANDS.ROOT
  },
  [ROUTES.DEMANDS.EDIT("[id]")]: {
    permissions: [PERMISSIONS.MANAGE_DEMANDS],
    requireAuthentication: true,
    title: TRANSLATIONS_KEYS_2.DEMANDS.FORM.TITLES.UPDATE,
    backLink: ROUTES.DEMANDS.ROOT
  },
  [ROUTES.DOCUMENTS.ROOT]: {
    permissions: [PERMISSIONS.VIEW_DOCUMENTS],
    requireAuthentication: true,
    title: TRANSLATIONS_KEYS_2.DOCUMENTS.TITLE,
  },
  [ROUTES.NOTIFICATIONS.ROOT]: {
    permissions: [PERMISSIONS.VIEW_NOTIFICATIONS],
    requireAuthentication: true,
    title: TRANSLATIONS_KEYS_2.NOTIFICATIONS.TITLE,
  },
  [ROUTES.EVENTS.ROOT]: {
    permissions: [PERMISSIONS.VIEW_EVENTS],
    requireAuthentication: true,
    title: TRANSLATIONS_KEYS_2.EVENTS.TITLE,
  },
  [ROUTES.EVENTS.CREATE]: {
    permissions: [PERMISSIONS.MANAGE_EVENTS],
    requireAuthentication: true,
    title: TRANSLATIONS_KEYS_2.EVENTS.FORM.TITLES.CREATE,
    backLink: ROUTES.EVENTS.ROOT
  },
  [ROUTES.EVENTS.EDIT("[id]")]: {
    permissions: [PERMISSIONS.MANAGE_EVENTS],
    requireAuthentication: true,
    title: TRANSLATIONS_KEYS_2.EVENTS.FORM.TITLES.UPDATE,
    backLink: ROUTES.EVENTS.ROOT
  },

  // --- BILLS CONFIG ---
  [ROUTES.SETTINGS.BILLS.MODELS.ROOT]: {
    permissions: [PERMISSIONS.VIEW_BILL_MODELS],
    requireAuthentication: true,
    title: TRANSLATIONS_KEYS_2.SETTINGS.BILLS.MODELS.TITLE,
  },
  [ROUTES.SETTINGS.BILLS.STATUSES.ROOT]: {
    permissions: [PERMISSIONS.MANAGE_BILL_MODELS],
    requireAuthentication: true,
    title: TRANSLATIONS_KEYS_2.SETTINGS.BILLS.STATUSES.TITLE,
  },
};
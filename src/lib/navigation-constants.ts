// lib/constants/routes.ts or constants/routes.ts

export const NAVIGATION_KEYS = {
  // Unprotected routes
  LOGIN: "/login",

  // Main protected routes
  DASHBOARD: "/dashboard",

  // Biens routes
  BIENS: {
    ROOT: "/biens",
    ADD: "/biens/add",
    DETAIL: (id: string | number) => `/biens/${id}`,
    EDIT: (id: string | number) => `/biens/${id}`,
  },

  // Clients routes
  CLIENTS: {
    ROOT: "/clients",
    ADD: "/clients/add",
    DETAIL: (id: string | number) => `/clients/${id}`,
    EDIT: (id: string | number) => `/clients/${id}`,
  },

  // Demands routes
  DEMANDS: {
    ROOT: "/demands",
    ADD: "/demands/ajouter",
    EDIT: (id: string | number) => `/demands/${id}`,
  },

  // Offers routes
  OFFERS: {
    ROOT: "/offers",
    ADD: "/offers/add",
    DETAIL: (id: string | number) => `/offers/${id}`,
    EDIT: (id: string | number) => `/offers/${id}`,
  },

  // Settings routes
  SETTINGS: {
    ROOT: "/settings",

    // Biens settings
    BIENS: {
      ROOT: "/settings/biens",
      CHARACTERISTICS: {
        ROOT: "/settings/biens/characteristics",
        ADD: "/settings/biens/characteristics/add",
        DETAIL: (id: string | number) => `/settings/biens/characteristics/${id}`,
        EDIT: (id: string | number) => `/settings/biens/characteristics/${id}`,
      },
      STATUS: {
        ROOT: "/settings/biens/status",
        ADD: "/settings/biens/status/add",
        DETAIL: (id: string | number) => `/settings/biens/status/${id}`,
        EDIT: (id: string | number) => `/settings/biens/status/${id}`,
      },
      TYPES: {
        ROOT: "/settings/biens/types",
        ADD: "/settings/biens/types/add",
        DETAIL: (id: string | number) => `/settings/biens/types/${id}`,
        EDIT: (id: string | number) => `/settings/biens/types/${id}`,
      },
    },

    // Clients settings
    CLIENTS: {
      ROOT: "/settings/clients",
      SOURCES: {
        ROOT: "/settings/clients/sources",
        ADD: "/settings/clients/sources/add",
        DETAIL: (id: string | number) => `/settings/clients/sources/${id}`,
        EDIT: (id: string | number) => `/settings/clients/sources/${id}`,
      },
      STATUS: {
        ROOT: "/settings/clients/status",
        ADD: "/settings/clients/status/add",
        DETAIL: (id: string | number) => `/settings/clients/status/${id}`,
        EDIT: (id: string | number) => `/settings/clients/status/${id}`,
      },
      TYPES: {
        ROOT: "/settings/clients/types",
        ADD: "/settings/clients/types/add",
        DETAIL: (id: string | number) => `/settings/clients/types/${id}`,
        EDIT: (id: string | number) => `/settings/clients/types/${id}`,
      },
    },

    // Colors settings
    COLORS: {
      ROOT: "/settings/colors",
      ADD: "/settings/colors/add",
      DETAIL: (id: string | number) => `/settings/colors/${id}`,
      EDIT: (id: string | number) => `/settings/colors/${id}`,
    },

    // Locations settings
    LOCATIONS: {
      ROOT: "/settings/locations",
    },

    // Offers settings
    OFFERS: {
      ROOT: "/settings/offers",
      STATUS: {
        ROOT: "/settings/offers/status",
        ADD: "/settings/offers/status/add",
        DETAIL: (id: string | number) => `/settings/offers/status/${id}`,
        EDIT: (id: string | number) => `/settings/offers/status/${id}`,
      },
      TYPES: {
        ROOT: "/settings/offers/types",
        ADD: "/settings/offers/types/add",
        DETAIL: (id: string | number) => `/settings/offers/types/${id}`,
        EDIT: (id: string | number) => `/settings/offers/types/${id}`,
      },
    },

    // Profile settings
    PROFILE: {
      ROOT: "/settings/profile",
    },

    // Roles settings
    ROLES: {
      ROOT: "/settings/roles",
      ADD: "/settings/roles/add",
      DETAIL: (id: string | number) => `/settings/roles/${id}`,
      EDIT: (id: string | number) => `/settings/roles/${id}`,
    },

    // Transactions settings
    TRANSACTIONS: {
      ROOT: "/settings/transactions",
      TYPES: {
        ROOT: "/settings/transactions/types",
        ADD: "/settings/transactions/types/add",
        DETAIL: (id: string | number) => `/settings/transactions/types/${id}`,
        EDIT: (id: string | number) => `/settings/transactions/types/${id}`,
      },
    },

    // Users settings
    USERS: {
      ROOT: "/settings/users",
      ADD: "/settings/users/add",
      DETAIL: (id: string | number) => `/settings/users/${id}`,
      EDIT: (id: string | number) => `/settings/users/${id}`,
    },
  },
} as const;

// Helper type for type safety
export type NAVIGATION_KEYS = typeof NAVIGATION_KEYS;

export const ROUTES = {

  SESSION: {
    EXPIRED: "/session-expired"
  },
  AUTH: {
    LOGIN: "/login",
    FORGET_PASSWORD: "/password/forget",
    RESET_PASSWORD: "/password/reset",
  },

  DASHBOARD: "/dashboard",

  STATISTICS: {
    ROOT: "/statistics",
    SECTION: (section: string) => `/statistics/${section}`,
  },

  BIENS: {
    ROOT: "/biens",
    CREATE: "/biens/create",
    DETAIL: (id: string | number) => `/biens/${id}`,
    EDIT: (id: string | number) => `/biens/${id}`,
  },

  BILLS: {
    ROOT: "/bills",
    CREATE: "/bills/create",
    DETAIL: (id: string | number) => `/bills/${id}`,
    EDIT: (id: string | number) => `/bills/${id}`,
  },

  CLIENTS: {
    ROOT: "/clients",
    CREATE: "/clients/create",
    DETAIL: (id: string | number) => `/clients/${id}`,
    EDIT: (id: string | number) => `/clients/${id}`,
  },

  DEMANDS: {
    ROOT: "/demands",
    CREATE: "/demands/create",
    DETAILS: (id: string | number) => `/demands/${id}`,
    EDIT: (id: string | number) => `/demands/${id}`,
  },

  OFFERS: {
    ROOT: "/offers",
    CREATE: "/offers/create",
    DETAIL: (id: string | number) => `/offers/${id}`,
    EDIT: (id: string | number) => `/offers/${id}`,
  },

  EVENTS: {
    ROOT: "/events",
    CREATE: "/events/create",
    DETAIL: (id: string | number) => `/events/${id}`,
    EDIT: (id: string | number) => `/events/${id}`,
  },

  DOCUMENTS: {
    ROOT: "/documents",
  },

  NOTIFICATIONS: {
    ROOT: "/notifications",
  },

  SETTINGS: {
    ROOT: "/settings",

    BIENS: {
      ROOT: "/settings/biens",
      CHARACTERISTICS: {
        ROOT: "/settings/biens/characteristics",
      },
      STATUSES: {
        ROOT: "/settings/biens/statuses",
      },
      TYPES: {
        ROOT: "/settings/biens/types",
      },
      PRIORITIES: {
        ROOT: "/settings/biens/priorities",
      },
    },

    CLIENTS: {
      ROOT: "/settings/clients",
      SOURCES: {
        ROOT: "/settings/clients/sources",
      },
      STATUSES: {
        ROOT: "/settings/clients/statuses",
      },
      TYPES: {
        ROOT: "/settings/clients/types",
      },
    },

    COLORS: {
      ROOT: "/settings/colors",
    },

    LOCATIONS: {
      ROOT: "/settings/locations",
    },

    OFFERS: {
      ROOT: "/settings/offers",
      STATUSES: {
        ROOT: "/settings/offers/statuses",
      },
      TYPES: {
        ROOT: "/settings/offers/types",
      },
      SOURCES: {
        ROOT: "/settings/offers/sources",
      },
    },

    DEMANDS: {
      ROOT: "/settings/demands",
      STATUSES: {
        ROOT: "/settings/demands/statuses",
      },
      TYPES: {
        ROOT: "/settings/demands/types",
      },
      SOURCES: {
        ROOT: "/settings/demands/sources",
      },
      PRIORITIES: {
        ROOT: "/settings/demands/priorities",
      },
    },

    TRANSACTIONS: {
      ROOT: "/settings/transactions",
      TYPES: {
        ROOT: "/settings/transactions/types",
      },
    },

    EVENTS: {
      ROOT: "/settings/events",
      TYPES: {
        ROOT: "/settings/events/types",
      },
      COLORS: {
        ROOT: "/settings/events/colors",
      },
    },

    USERS: {
      ROOT: "/settings/users",
      CREATE: "/settings/users/create",
      DETAIL: (id: string | number) => `/settings/users/${id}`,
      EDIT: (id: string | number) => `/settings/users/${id}`,
    },

    ROLES: {
      ROOT: "/settings/roles",
      ADD: "/settings/roles/add",
      DETAIL: (id: string | number) => `/settings/roles/${id}`,
      EDIT: (id: string | number) => `/settings/roles/${id}`,
    },

    NOTIFICATIONS: {
      ROOT: "/settings/notifications",
    },

    BILLS: {
      PAYMENTS: {
        STATUSES: {
          ROOT: "/settings/bills/payments/statuses",
        },
        METHODS: {
          ROOT: "/settings/bills/payments/methods",
        },
      },
      MODELS: {
        ROOT: "/settings/bills/models",
        CREATE: "/settings/bills/models/create",
        DETAIL: (id: string | number) => `/settings/bills/models/${id}`,
        EDIT: (id: string | number) => `/settings/bills/models/${id}`,
      },
      STATUSES: {
        ROOT: "/settings/bills/statuses",
      },
    },
  },

  PROFILE: {
    ROOT: "/settings/profile",
  },
};
export type NAVIGATION_KEYS = typeof ROUTES;

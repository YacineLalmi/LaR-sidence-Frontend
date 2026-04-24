import SettingCard from "./_components/setting-card";
import { Bell, Building2, Calendar1, CreditCard, Map } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { SettingsItem } from "@/types/settings";
import { ROUTES } from "@/constants/routes";
import { TRANSLATIONS_KEYS_2 } from "@/i18n/translation-keys";

const CONFIG_MODULES: SettingsItem[] = [
  {
    id: "application",
    title: TRANSLATIONS_KEYS_2.SETTINGS.APPLICATION.TITLE,
    description: TRANSLATIONS_KEYS_2.SETTINGS.APPLICATION.DESCRIPTION,
    icon: Building2,
    subs: [
      {
        id: "users",
        title: TRANSLATIONS_KEYS_2.SETTINGS.USERS.TITLE,
        link: ROUTES.SETTINGS.USERS.ROOT,
      },
      {
        id: "roles",
        title: TRANSLATIONS_KEYS_2.SETTINGS.ROLES.TITLE,
        link: ROUTES.SETTINGS.ROLES.ROOT,
      },
      {
        id: "colors",
        title: TRANSLATIONS_KEYS_2.SETTINGS.COLORS.TITLE,
        link: ROUTES.SETTINGS.COLORS.ROOT,
      },
      {
        id: "notifications",
        title: TRANSLATIONS_KEYS_2.SETTINGS.NOTIFICATIONS.TITLE,
        link: ROUTES.SETTINGS.NOTIFICATIONS.ROOT,
      },
    ],
  },
  {
    id: "biens",
    title: TRANSLATIONS_KEYS_2.SETTINGS.BIENS.TITLE,
    description: TRANSLATIONS_KEYS_2.SETTINGS.BIENS.DESCRIPTION,
    icon: Building2,
    subs: [
      {
        id: "bien_types",
        title: TRANSLATIONS_KEYS_2.SETTINGS.BIENS.TYPES.TITLE,
        link: ROUTES.SETTINGS.BIENS.TYPES.ROOT,
      },
      {
        id: "bien_characteristics",
        title: TRANSLATIONS_KEYS_2.SETTINGS.BIENS.CHARACTERISTICS.TITLE,
        link: ROUTES.SETTINGS.BIENS.CHARACTERISTICS.ROOT,
      },
      {
        id: "bien_statuses",
        title: TRANSLATIONS_KEYS_2.SETTINGS.BIENS.STATUSES.TITLE,
        link: ROUTES.SETTINGS.BIENS.STATUSES.ROOT,
      },
      {
        id: "bien_priorities",
        title: TRANSLATIONS_KEYS_2.SETTINGS.BIENS.PRIORITIES.TITLE,
        link: ROUTES.SETTINGS.BIENS.PRIORITIES.ROOT,
      },
    ],
  },
  {
    id: "clients",
    title: TRANSLATIONS_KEYS_2.SETTINGS.CLIENTS.TITLE,
    description: TRANSLATIONS_KEYS_2.SETTINGS.CLIENTS.DESCRIPTION,
    icon: Building2,
    subs: [
      {
        id: "client_types",
        title: TRANSLATIONS_KEYS_2.SETTINGS.CLIENTS.TYPES.TITLE,
        link: ROUTES.SETTINGS.CLIENTS.TYPES.ROOT,
      },
      {
        id: "client_sources",
        title: TRANSLATIONS_KEYS_2.SETTINGS.CLIENTS.SOURCES.TITLE,
        link: ROUTES.SETTINGS.CLIENTS.SOURCES.ROOT,
      },
      {
        id: "client_statuses",
        title: TRANSLATIONS_KEYS_2.SETTINGS.CLIENTS.STATUSES.TITLE,
        link: ROUTES.SETTINGS.CLIENTS.STATUSES.ROOT,
      },
    ],
  },
  {
    id: "offers",
    title: TRANSLATIONS_KEYS_2.SETTINGS.OFFERS.TITLE,
    description: TRANSLATIONS_KEYS_2.SETTINGS.OFFERS.DESCRIPTION,
    icon: Building2,
    subs: [
      {
        id: "offer_types",
        title: TRANSLATIONS_KEYS_2.SETTINGS.OFFERS.TYPES.TITLE,
        link: ROUTES.SETTINGS.OFFERS.TYPES.ROOT,
      },
      {
        id: "offer_statuses",
        title: TRANSLATIONS_KEYS_2.SETTINGS.OFFERS.STATUSES.TITLE,
        link: ROUTES.SETTINGS.OFFERS.STATUSES.ROOT,
      },
    ],
  },
  {
    id: "demands",
    title: TRANSLATIONS_KEYS_2.SETTINGS.DEMANDS.TITLE,
    description: TRANSLATIONS_KEYS_2.SETTINGS.DEMANDS.DESCRIPTION,
    icon: Building2,
    subs: [
      {
        id: "demand_types",
        title: TRANSLATIONS_KEYS_2.SETTINGS.DEMANDS.TYPES.TITLE,
        link: ROUTES.SETTINGS.DEMANDS.TYPES.ROOT,
      },
      {
        id: "demand_statuses",
        title: TRANSLATIONS_KEYS_2.SETTINGS.DEMANDS.STATUSES.TITLE,
        link: ROUTES.SETTINGS.DEMANDS.STATUSES.ROOT,
      },
      {
        id: "demand_sources",
        title: TRANSLATIONS_KEYS_2.SETTINGS.DEMANDS.SOURCES.TITLE,
        link: ROUTES.SETTINGS.DEMANDS.SOURCES.ROOT,
      },
      {
        id: "demand_priorities",
        title: TRANSLATIONS_KEYS_2.SETTINGS.DEMANDS.PRIORITIES.TITLE,
        link: ROUTES.SETTINGS.DEMANDS.PRIORITIES.ROOT,
      },
    ],
  },
  {
    id: "events",
    title: TRANSLATIONS_KEYS_2.SETTINGS.EVENTS.TITLE,
    description: TRANSLATIONS_KEYS_2.SETTINGS.EVENTS.DESCRIPTION,
    icon: Calendar1,
    subs: [
      {
        id: "event_types",
        title: TRANSLATIONS_KEYS_2.SETTINGS.EVENTS.TYPES.TITLE,
        link: ROUTES.SETTINGS.EVENTS.TYPES.ROOT,
      },
      {
        id: "event_colors",
        title: TRANSLATIONS_KEYS_2.SETTINGS.EVENTS.COLORS,
        link: ROUTES.SETTINGS.EVENTS.COLORS.ROOT,
      },
    ],
  },
  {
    id: "transactions",
    title: TRANSLATIONS_KEYS_2.SETTINGS.TRANSACTIONS.TITLE,
    description: TRANSLATIONS_KEYS_2.SETTINGS.TRANSACTIONS.DESCRIPTION,
    icon: CreditCard,
    subs: [
      {
        id: "transaction_types",
        title: TRANSLATIONS_KEYS_2.SETTINGS.TRANSACTIONS.TYPES.TITLE,
        link: ROUTES.SETTINGS.TRANSACTIONS.TYPES.ROOT,
      },
    ],
  },
  {
    id: "lieux",
    title: TRANSLATIONS_KEYS_2.SETTINGS.LOCATIONS.TITLE,
    description: TRANSLATIONS_KEYS_2.SETTINGS.LOCATIONS.DESCRIPTION,
    icon: Map,
    subs: [
      {
        id: "wilaya_communes",
        title: TRANSLATIONS_KEYS_2.SETTINGS.LOCATIONS.WILAYA_COMMUNE,
        link: ROUTES.SETTINGS.LOCATIONS.ROOT,
      },
    ],
  },
  {
    id: "bills",
    title: TRANSLATIONS_KEYS_2.SETTINGS.BILLS.TITLE,
    description: TRANSLATIONS_KEYS_2.SETTINGS.BILLS.DESCRIPTION,
    icon: Map,
    subs: [
      {
        id: "bill_payments_statuses",
        title: TRANSLATIONS_KEYS_2.SETTINGS.BILLS.PAYMENTS.STATUSES.TITLE,
        link: ROUTES.SETTINGS.BILLS.PAYMENTS.STATUSES.ROOT,
      },
      {
        id: "bill_payments_methods",
        title: TRANSLATIONS_KEYS_2.SETTINGS.BILLS.PAYMENTS.METHODS.TITLE,
        link: ROUTES.SETTINGS.BILLS.PAYMENTS.METHODS.ROOT,
      },
      {
        id: "billing_models",
        title: TRANSLATIONS_KEYS_2.SETTINGS.BILLS.MODELS.TITLE,
        link: ROUTES.SETTINGS.BILLS.MODELS.ROOT,
      },
    ],
  },
];

export default async function Settings() {
  const translation = await getTranslations();
  return (
    <>
      <h1 className="font-semibold text-[32px] mb-2">{translation(TRANSLATIONS_KEYS_2.SETTINGS.TITLE)}</h1>
      <div className="grid grid-cols-3 gap-3">
        {CONFIG_MODULES.map((module) => (
          <SettingCard key={module.id} module={module} />
        ))}
      </div>
    </>
  );
}

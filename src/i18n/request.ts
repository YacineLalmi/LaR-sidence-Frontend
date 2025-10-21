import Settings from "@/components/navbar/components/settings";
import { getCookie } from "@/lib/server.helper";
import { se } from "date-fns/locale";
import { getRequestConfig } from "next-intl/server";

// Helper function to load all message files for a locale
async function loadMessages(locale: string) {
  const common = (await import(`./messages/common/${locale}.json`)).default;
  const login = (await import(`./messages/login/${locale}.json`)).default;
  const biens = (await import(`./messages/biens/${locale}.json`)).default;
  const settings = (await import(`./messages/settings/${locale}.json`)).default;
  const settingUsers = (await import(`./messages/settings/users/${locale}.json`)).default;
  const settingWilayas = (await import(`./messages/settings/wilayas/${locale}.json`)).default;
  const settingsRoles = (await import(`./messages/settings/roles/${locale}.json`)).default;

  return {
    common,
    login,
    biens,
    settings: {
      ...settings,
      users: settingUsers,
      wilayas: settingWilayas,
      roles: settingsRoles,
    },
  };
}

export default getRequestConfig(async () => {
  const locale = (await getCookie("lang")) ?? "fr";

  const messages = await loadMessages(locale);

  return {
    locale,
    messages,
    timeZone: "UTC",
    now: new Date(),
  };
});

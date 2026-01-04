
import { getCookie } from "@/lib/server.helper";
import { getRequestConfig } from "next-intl/server";

// Helper function to load all message files for a locale
async function loadMessages(locale: string) {
  const common = (await import(`./messages/common/${locale}.json`)).default;
  const login = (await import(`./messages/login/${locale}.json`)).default;
  const biens = (await import(`./messages/biens/${locale}.json`)).default;
  const clients = (await import(`./messages/clients/${locale}.json`)).default;
  const settings = (await import(`./messages/settings/${locale}.json`)).default;
  const offers = (await import(`./messages/offers/${locale}.json`)).default;
  const settingUsers = (await import(`./messages/settings/users/${locale}.json`)).default;
  const settingLocations = (await import(`./messages/settings/locations/${locale}.json`)).default;
  const settingsRoles = (await import(`./messages/settings/roles/${locale}.json`)).default;
  const settingProfile = (await import(`./messages/settings/profile/${locale}.json`)).default;
  const settingColors = (await import(`./messages/settings/colors/${locale}.json`)).default;
  const settingClientSources = (await import(`./messages/settings/client-sources/${locale}.json`)).default;
  const settingClientStatus = (await import(`./messages/settings/client-status/${locale}.json`)).default;
  const settingClientTypes = (await import(`./messages/settings/client-types/${locale}.json`)).default;
  const settingOfferStatus = (await import(`./messages/settings/offer-status/${locale}.json`)).default;
  const settingOfferTypes = (await import(`./messages/settings/offer-types/${locale}.json`)).default;
  const settingBienTypes = (await import(`./messages/settings/bien-types/${locale}.json`)).default;
  const settingTransactionTypes = (await import(`./messages/settings/transaction-types/${locale}.json`)).default;
  const settingBienStatus = (await import(`./messages/settings/bien-status/${locale}.json`)).default;
  const settingBienAdditionalCharacteristics= (await import(`./messages/settings/bien-additional-characteristics/${locale}.json`)).default;

  return {
    common,
    login,
    biens,
    offers,
    clients,
    settings: {
      ...settings,
      biens: {
        types: settingBienTypes,
        status: settingBienStatus,
        characteristics: settingBienAdditionalCharacteristics
      },
      users: settingUsers,
      locations: settingLocations,
      roles: settingsRoles,
      profile: settingProfile,
      colors: settingColors,
      clientStatus: settingClientStatus,
      clientSources: settingClientSources,
      clientTypes: settingClientTypes,
      bienTypes: settingBienTypes,
      transactionTypes: settingTransactionTypes,
      bienStatus: settingBienStatus,
      offerStatus: settingOfferStatus,
      offerTypes: settingOfferTypes,
      bienAdditionalcharacteristics: settingBienAdditionalCharacteristics,
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

import React from "react";
import { Cog } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { TRANSLATIONS_KEYS } from "@/i18n/translation-constants";
import SettingCard from "../_components/card";
import NavigationButton from "@/components/ui/navigation-button";
import { NAVIGATION_KEYS } from "@/lib/navigation-constants";

export default async function Settings() {
  const settingsTranslations = await getTranslations();
  return (
    <>
      <NavigationButton
        title={settingsTranslations(TRANSLATIONS_KEYS.SETTINGS.CLIENTS.TITLE)}
        backLink={NAVIGATION_KEYS.SETTINGS.ROOT}
      />
      <h1 className="font-semibold text-[32px] mb-2"></h1>
      <div className="grid grid-cols-3 gap-3">
        <SettingCard
          link={NAVIGATION_KEYS.SETTINGS.CLIENTS.TYPES.ROOT}
          title={settingsTranslations(TRANSLATIONS_KEYS.SETTINGS.CLIENTS.TYPES.TITLE)}
          icon={Cog}
        />
        <SettingCard
          link={NAVIGATION_KEYS.SETTINGS.CLIENTS.STATUS.ROOT}
          title={settingsTranslations(TRANSLATIONS_KEYS.SETTINGS.CLIENTS.STATUS.TITLE)}
          icon={Cog}
        />
        <SettingCard
          link={NAVIGATION_KEYS.SETTINGS.CLIENTS.SOURCES.ROOT}
          title={settingsTranslations(TRANSLATIONS_KEYS.SETTINGS.CLIENTS.SOURCES.TITLE)}
          icon={Cog}
        />
      </div>
    </>
  );
}

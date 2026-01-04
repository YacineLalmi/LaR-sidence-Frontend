import React from "react";
import SettingCard from "./_components/card";
import { BadgeCheck, BadgeEuro, Building2, MapPinned, Shield, UserRoundCog, UsersRound } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { TRANSLATIONS_KEYS } from "@/i18n/translation-constants";
import { NAVIGATION_KEYS } from "@/lib/navigation-constants";

export default async function Settings() {
  const settingsTranslations = await getTranslations();
  return (
    <>
      <h1 className="font-semibold text-[32px] mb-2">{settingsTranslations(TRANSLATIONS_KEYS.SETTINGS.TITLE)}</h1>
      <div className="grid grid-cols-3 gap-3">
        <SettingCard
          link={NAVIGATION_KEYS.SETTINGS.LOCATIONS.ROOT}
          title={settingsTranslations(TRANSLATIONS_KEYS.SETTINGS.LOCATIONS.TITLE)}
          icon={MapPinned}
        />
        <SettingCard
          link={NAVIGATION_KEYS.SETTINGS.USERS.ROOT}
          title={settingsTranslations(TRANSLATIONS_KEYS.SETTINGS.USERS.TITLE)}
          icon={UsersRound}
        />
        <SettingCard
          link={NAVIGATION_KEYS.SETTINGS.BIENS.ROOT}
          title={settingsTranslations(TRANSLATIONS_KEYS.SETTINGS.BIENS.TITLE)}
          icon={Building2}
        />
        <SettingCard
          link={NAVIGATION_KEYS.SETTINGS.CLIENTS.ROOT}
          title={settingsTranslations(TRANSLATIONS_KEYS.SETTINGS.CLIENTS.TITLE)}
          icon={UserRoundCog}
        />
        <SettingCard
          link={NAVIGATION_KEYS.SETTINGS.TRANSACTIONS.ROOT}
          title={settingsTranslations(TRANSLATIONS_KEYS.SETTINGS.TRANSACTIONS.TITLE)}
          icon={Building2}
        />
        <SettingCard
          link={NAVIGATION_KEYS.SETTINGS.OFFERS.ROOT}
          title={settingsTranslations(TRANSLATIONS_KEYS.SETTINGS.OFFERS.TITLE)}
          icon={Building2}
        />
        <SettingCard
          link={NAVIGATION_KEYS.SETTINGS.PROFILE.ROOT}
          title={settingsTranslations(TRANSLATIONS_KEYS.SETTINGS.PROFILE.TITLE)}
          icon={BadgeCheck}
        />
        <SettingCard
          link={NAVIGATION_KEYS.SETTINGS.COLORS.ROOT}
          title={settingsTranslations(TRANSLATIONS_KEYS.SETTINGS.COLORS.TITLE)}
          icon={BadgeCheck}
        />
      </div>
    </>
  );
}

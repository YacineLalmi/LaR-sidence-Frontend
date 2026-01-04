import React from "react";
import NavigationButton from "@/components/ui/navigation-button";
import { getTranslations } from "next-intl/server";
import WilayaView from "./_components/wilaya-view";
import CommuneView from "./_components/commune-view";
import { TRANSLATIONS_KEYS } from "@/i18n/translation-constants";
import { NAVIGATION_KEYS } from "@/lib/navigation-constants";

export default async function Location({ searchParams }: { searchParams: Promise<{ [key: string]: string }> }) {
  const queryParams = await searchParams;
  const locationTranslation = await getTranslations();
  return (
    <div className="flex flex-col">
      <NavigationButton title={locationTranslation(TRANSLATIONS_KEYS.SETTINGS.LOCATIONS.TITLE)} backLink={NAVIGATION_KEYS.SETTINGS.ROOT} />
      <div className="grid grid-cols-2 gap-[32px]">
        <WilayaView searchParams={queryParams} />
        <CommuneView searchParams={queryParams} />
      </div>
    </div>
  );
}

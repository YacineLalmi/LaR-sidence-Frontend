import React from "react";
import { ColorService } from "@/services/colors.service";
import ColorTable from "./_components/color-table";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import NavigationButton from "@/components/ui/navigation-button";
import { TRANSLATIONS_KEYS } from "@/i18n/translation-constants";
import { NAVIGATION_KEYS } from "@/lib/navigation-constants";
import SearchField from "@/components/ui/search";
import { getTranslations } from "next-intl/server";
import CreateColorDialog from "./_components/create-color-dialog";

export default async function Colors({ searchParams }: { searchParams: Promise<{ [key: string]: string }> }) {
  const queryParams = await searchParams;
  const translation = await getTranslations();

  const data = await ColorService.findAll(queryParams);
  return (
    <Card className="bg-transparent border-none shadow-none p-0">
      <CardHeader className="px-0 flex flex-col">
        <NavigationButton
          title={translation(TRANSLATIONS_KEYS.SETTINGS.COLORS.TITLE)}
          backLink={NAVIGATION_KEYS.SETTINGS.ROOT}
        />
        {/* <h1 className="text-[24px] font-bold">{translation(TRANSLATIONS_KEYS.SETTINGS.BIENS.TYPES.TITLE)}</h1> */}
        <div className="flex w-full justify-between gap-2">
          <SearchField />
          <CreateColorDialog />
        </div>
      </CardHeader>
      <CardContent className="px-0">
        <ColorTable data={data} />
      </CardContent>
    </Card>
  );
}

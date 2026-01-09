import React from "react";
import { BienStatusService } from "@/services/bien-status.service";
import BienStatusTable from "./_components/bien-status-table";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import NavigationButton from "@/components/ui/navigation-button";
import { getTranslations } from "next-intl/server";
import { TRANSLATIONS_KEYS } from "@/i18n/translation-constants";
import { NAVIGATION_KEYS } from "@/lib/navigation-constants";
import SearchField from "@/components/ui/search";
import CreateBienStatusDialog from "./_components/create-bien-status-dialog";
import { ColorService } from "@/services/colors.service";

export default async function BienStatus({ searchParams }: { searchParams: Promise<{ [key: string]: string }> }) {
  const queryParams = await searchParams;
  const translation = await getTranslations();

  const colors = await ColorService.list();
  const data = await BienStatusService.findAll(queryParams);

  return (
    <Card className="bg-transparent border-none shadow-none p-0">
      <CardHeader className="px-0 flex flex-col">
        <NavigationButton
          title={translation(TRANSLATIONS_KEYS.SETTINGS.BIENS.STATUS.TITLE)}
          backLink={NAVIGATION_KEYS.SETTINGS.BIENS.ROOT}
        />
        {/* <h1 className="text-[24px] font-bold">{translation(TRANSLATIONS_KEYS.SETTINGS.BIENS.TYPES.TITLE)}</h1> */}
        <div className="flex w-full justify-between gap-2">
          <SearchField />
          <CreateBienStatusDialog colors={colors} />
        </div>
      </CardHeader>
      <CardContent className="px-0">
        <BienStatusTable colors={colors} data={data} />
      </CardContent>
    </Card>
  );
}

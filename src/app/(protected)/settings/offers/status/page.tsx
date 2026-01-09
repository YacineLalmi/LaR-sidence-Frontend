import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import NavigationButton from "@/components/ui/navigation-button";
import { getTranslations } from "next-intl/server";
import { TRANSLATIONS_KEYS } from "@/i18n/translation-constants";
import { NAVIGATION_KEYS } from "@/lib/navigation-constants";
import SearchField from "@/components/ui/search";
import { ColorService } from "@/services/colors.service";
import { OfferStatusService } from "@/services/offer-status.service";
import CreateOfferStatusDialog from "./_components/create-offer-status-dialog";
import OfferStatusTable from "./_components/offer-status-table";

export default async function OfferStatus({ searchParams }: { searchParams: Promise<{ [key: string]: string }> }) {
  const queryParams = await searchParams;
  const translation = await getTranslations();

  const colors = await ColorService.list();
  const data = await OfferStatusService.findAll(queryParams);

  return (
    <Card className="bg-transparent border-none shadow-none p-0">
      <CardHeader className="px-0 flex flex-col">
        <NavigationButton
          title={translation(TRANSLATIONS_KEYS.SETTINGS.OFFERS.STATUS.TITLE)}
          backLink={NAVIGATION_KEYS.SETTINGS.OFFERS.ROOT}
        />
        {/* <h1 className="text-[24px] font-bold">{translation(TRANSLATIONS_KEYS.SETTINGS.BIENS.TYPES.TITLE)}</h1> */}
        <div className="flex w-full justify-between gap-2">
          <SearchField />
          <CreateOfferStatusDialog colors={colors} />
        </div>
      </CardHeader>
      <CardContent className="px-0">
        <OfferStatusTable colors={colors} data={data} />
      </CardContent>
    </Card>
  );
}

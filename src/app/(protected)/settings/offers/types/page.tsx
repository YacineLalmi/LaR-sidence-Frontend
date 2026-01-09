import React from "react";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { getTranslations } from "next-intl/server";
import { TRANSLATIONS_KEYS } from "@/i18n/translation-constants";
import SearchField from "@/components/ui/search";
import NavigationButton from "@/components/ui/navigation-button";
import { NAVIGATION_KEYS } from "@/lib/navigation-constants";
import { OfferTypeService } from "@/services/offer-types.service";
import CreateOfferTypeDialog from "./_components/create-offer-type-dialog";
import OfferTypeTable from "./_components/offer-type-table";

export default async function OfferType({ searchParams }: { searchParams: Promise<{ [key: string]: string }> }) {
  const queryParams = await searchParams;
  const translation = await getTranslations();

  const data = await OfferTypeService.findAll(queryParams);
  return (
    <Card className="bg-transparent border-none shadow-none p-0">
      <CardHeader className="px-0 flex flex-col">
        <NavigationButton
          title={translation(TRANSLATIONS_KEYS.SETTINGS.OFFERS.TYPES.TITLE)}
          backLink={NAVIGATION_KEYS.SETTINGS.OFFERS.ROOT}
        />
        {/* <h1 className="text-[24px] font-bold">{translation(TRANSLATIONS_KEYS.SETTINGS.BIENS.TYPES.TITLE)}</h1> */}
        <div className="flex w-full justify-between gap-2">
          <SearchField />
          <CreateOfferTypeDialog />
        </div>
      </CardHeader>
      <CardContent className="px-0">
        <OfferTypeTable data={data} />
      </CardContent>
    </Card>
  );
}

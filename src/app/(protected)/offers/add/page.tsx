import { ClientService } from "@/services/client.service";
import React from "react";
import CreateOfferForm from "./_components/create-offer-form";
import { BienService } from "@/services/bien.service";
import { OfferTypeService } from "@/services/offer-types.service";
import { OfferStatusService } from "@/services/offer-status.service";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import NavigationButton from "@/components/ui/navigation-button";
import { useTranslations } from "next-intl";
import { TRANSLATIONS_KEYS } from "@/i18n/translation-constants";
import { NAVIGATION_KEYS } from "@/lib/navigation-constants";
import { getTranslations } from "next-intl/server";

export default async function OfferAdd() {
  const translation = await getTranslations();
  const biens = await BienService.list();
  const clients = await ClientService.list();
  const offerTypes = await OfferTypeService.list();
  const offerStatus = await OfferStatusService.list();

  return (
    <Card className="bg-transparent border-none shadow-none p-0">
      <CardHeader className="px-0 flex flex-col">
        <NavigationButton
          title={translation(TRANSLATIONS_KEYS.OFFERS.FORM.ADD_OFFER)}
          backLink={NAVIGATION_KEYS.OFFERS.ROOT}
        />
      </CardHeader>
      <CardContent className="px-0">
        <CreateOfferForm types={offerTypes} status={offerStatus} clients={clients} biens={biens} />
      </CardContent>
    </Card>
  );
}

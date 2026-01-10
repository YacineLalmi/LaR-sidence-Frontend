import { ClientService } from "@/services/client.service";
import React from "react";
import UpfateOfferForm from "./_components/update-offer-form";
import { getTranslations } from "next-intl/server";
import { BienService } from "@/services/bien.service";
import { OfferTypeService } from "@/services/offer-types.service";
import { OfferStatusService } from "@/services/offer-status.service";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import NavigationButton from "@/components/ui/navigation-button";
import { TRANSLATIONS_KEYS } from "@/i18n/translation-constants";
import { NAVIGATION_KEYS } from "@/lib/navigation-constants";
import { OfferService } from "@/services/offer.service";

export default async function UpdateForm({ params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id;
  const translation = await getTranslations();
  const offer = await OfferService.findOne(id);
  const biens = await BienService.list();
  const clients = await ClientService.list();
  const offerTypes = await OfferTypeService.list();
  const offerStatus = await OfferStatusService.list();

  return (
    <Card className="bg-transparent border-none shadow-none p-0">
      <CardHeader className="px-0 flex flex-col">
        <NavigationButton
          title={translation(TRANSLATIONS_KEYS.OFFERS.FORM.EDIT_OFFER)}
          backLink={NAVIGATION_KEYS.OFFERS.ROOT}
        />
      </CardHeader>
      <CardContent className="px-0">
        <UpfateOfferForm offer={offer} types={offerTypes} status={offerStatus} clients={clients} biens={biens} />
      </CardContent>
    </Card>
  );
}

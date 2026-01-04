import React from "react";
import { getTranslations } from "next-intl/server";
import { ClientService } from "@/services/clients.service";
import OffersTable from "./_components/offer-table";
import { BienService } from "@/services/Bien.service";
import { OfferService } from "@/services/offer.service";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { OfferTypeService } from "@/services/offer-types.service";
import { TRANSLATIONS_KEYS } from "@/i18n/translation-constants";
import { OfferStatusService } from "@/services/offer-status.service";
import OffersHeader from "./_components/offer-header";

export default async function Offers({ searchParams }: { searchParams: Promise<{ [key: string]: string }> }) {
  const queryParams = await searchParams;

  const offers = await OfferService.findAll(queryParams);
  const biens = await BienService.list();
  const types = await OfferTypeService.list();
  const clients = await ClientService.list();
  const status = await OfferStatusService.list();

  const translation = await getTranslations();
  return (
    <Card className="bg-transparent border-none shadow-none p-0">
      <CardHeader className="px-0 flex flex-col">
        <h1 className="text-[24px] font-bold">{translation(TRANSLATIONS_KEYS.OFFERS.TITLE)}</h1>
        <OffersHeader biens={biens} clients={clients} status={status} types={types} />
      </CardHeader>
      <CardContent className="px-0">
        <OffersTable data={offers} />
      </CardContent>
    </Card>
  );
}

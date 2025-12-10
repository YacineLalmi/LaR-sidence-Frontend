import React from "react";
import SettingsView from "@/views/settings.view";
import { OfferTypeService } from "@/services/offer-types.service";
import OfferTypeTable from "./_components/offer-type-table";

export default async function OfferType({ searchParams }: { searchParams: Promise<{ [key: string]: string }> }) {
  const queryParams = await searchParams;

  const data = await OfferTypeService.findAll(queryParams);
  return <SettingsView moduleName="offerTypes" modulePath="offers/types" table={<OfferTypeTable data={data} />} />;
}

import React from "react";
import SettingsView from "@/views/settings.view";
import { OfferStatusService } from "@/services/offer-status.service";
import OfferStatusTable from "./_components/offer-status-table";

export default async function OfferStatus({ searchParams }: { searchParams: Promise<{ [key: string]: string }> }) {
  const queryParams = await searchParams;

  const data = await OfferStatusService.findAll(queryParams);
  return <SettingsView moduleName="offerStatus" modulePath="offers/status" table={<OfferStatusTable data={data} />} />;
}

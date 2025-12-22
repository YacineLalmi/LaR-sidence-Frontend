import React from "react";

import SettingsView from "@/views/settings.view";
import { BienAdditionalcharacteristicsService } from "@/services/bien-additional-charactiristics.service";
import BienAdditionalcharacteristicsTable from "./_components/bien-additional-characteristics-table";

export default async function BienAdditionalcharacteristics({ searchParams }: { searchParams: Promise<{ [key: string]: string }> }) {
  const queryParams = await searchParams;

  const data = await BienAdditionalcharacteristicsService.findAll(queryParams);
  return <SettingsView moduleName="bienAdditionalcharacteristics" modulePath="biens/additional-characteristics" table={<BienAdditionalcharacteristicsTable data={data} />} />;
}

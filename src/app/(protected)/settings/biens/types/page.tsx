import React from "react";

import { BienTypeService } from "@/services/BienType.service";
import SettingsView from "@/views/settings.view";
import BienTypeTable from "./_components/bien-type-table";

export default async function BienType({ searchParams }: { searchParams: Promise<{ [key: string]: string }> }) {
  const queryParams = await searchParams;

  const data = await BienTypeService.findAll(queryParams);
  return <SettingsView moduleName="bienTypes" modulePath="biens/types" table={<BienTypeTable data={data} />} />;
}

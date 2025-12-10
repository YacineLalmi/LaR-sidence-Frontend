import React from "react";
import SettingsView from "@/views/settings.view";
import { ClientTypeService } from "@/services/client-types.service";
import ClientTypeTable from "./_components/client-type-table";

export default async function ClientType({ searchParams }: { searchParams: Promise<{ [key: string]: string }> }) {
  const queryParams = await searchParams;

  const data = await ClientTypeService.findAll(queryParams);
  return <SettingsView moduleName="clientTypes" modulePath="clients/types" table={<ClientTypeTable data={data} />} />;
}

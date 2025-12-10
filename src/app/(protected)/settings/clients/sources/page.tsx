import React from "react";
import SettingsView from "@/views/settings.view";
import ClientSourceTable from "./_components/client-source-table";
import { ClientSourceService } from "@/services/client-source.service";

export default async function ClientStatus({ searchParams }: { searchParams: Promise<{ [key: string]: string }> }) {
  const queryParams = await searchParams;

  const data = await ClientSourceService.findAll(queryParams);
  return (
    <SettingsView moduleName="clientSources" modulePath="clients/sources" table={<ClientSourceTable data={data} />} />
  );
}

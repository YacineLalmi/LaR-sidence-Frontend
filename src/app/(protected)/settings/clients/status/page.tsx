import React from "react";
import SettingsView from "@/views/settings.view";
import ClientStatusTable from "./_components/client-status-table";
import { ClientStatusService } from "@/services/client-status.service";

export default async function ClientStatus({ searchParams }: { searchParams: Promise<{ [key: string]: string }> }) {
  const queryParams = await searchParams;

  const data = await ClientStatusService.findAll(queryParams);
  return (
    <SettingsView moduleName="clientStatus" modulePath="clients/status" table={<ClientStatusTable data={data} />} />
  );
}

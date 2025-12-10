import React from "react";
import SettingsView from "@/views/settings.view";
import { BienStatusService } from "@/services/BienStatus.service";
import BienStatusTable from "./_components/bien-status-table";

export default async function BienStatus({ searchParams }: { searchParams: Promise<{ [key: string]: string }> }) {
  const queryParams = await searchParams;

  const data = await BienStatusService.findAll(queryParams);
  return <SettingsView moduleName="bienStatus" modulePath="biens/status" table={<BienStatusTable data={data} />} />;
}

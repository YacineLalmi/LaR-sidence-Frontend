import React from "react";
import SettingsView from "@/views/settings.view";
import { CommunesService } from "@/services/communes.service";
import CommuneTable from "./_components/communes-table";

export default async function Communes({ searchParams }: { searchParams: Promise<{ [key: string]: string }> }) {
  const queryParams = await searchParams;

  const data = await CommunesService.findAll(queryParams);
  return <SettingsView moduleName="communes" modulePath="communes" table={<CommuneTable data={data} />} />;
}
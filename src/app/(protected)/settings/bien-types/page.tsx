import React from "react";
import BienTypesTable from "./_components/BienTypesTable";
import { BienTypeService } from "@/services/BienType.service";
import SettingsView from "@/views/settings.view";

export default async function Utilisateurs({ searchParams }: { searchParams: Promise<{ [key: string]: string }> }) {
  const queryParams = await searchParams;

  const data = await BienTypeService.findAll(queryParams);
  return <SettingsView module="bien-type" table={<BienTypesTable data={data} />} />;
}

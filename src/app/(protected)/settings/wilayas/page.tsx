import React from "react";
import SettingsView from "@/views/settings.view";
import WilayasTable from "./_components/wilayas-table";
import { WilayasService } from "@/services/wilayas.service";

export default async function Commune({ searchParams }: { searchParams: Promise<{ [key: string]: string }> }) {
  const queryParams = await searchParams;

  const data = await WilayasService.findAll(queryParams);
  return <SettingsView moduleName="wilayas" modulePath="wilayas" table={<WilayasTable data={data} />} />;
}

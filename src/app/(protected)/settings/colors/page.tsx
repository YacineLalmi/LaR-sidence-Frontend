import React from "react";
import SettingsView from "@/views/settings.view";
import { ColorService } from "@/services/colors.service";
import ColorTable from "./_components/color-table";

export default async function Colors({ searchParams }: { searchParams: Promise<{ [key: string]: string }> }) {
  const queryParams = await searchParams;

  const data = await ColorService.findAll(queryParams);
  return <SettingsView moduleName="colors" modulePath="colors" table={<ColorTable data={data} />} />;
}

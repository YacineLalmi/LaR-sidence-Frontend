import React from "react";
import SettingsView from "@/views/settings.view";
import WilayasTable from "./_components/wilayas-table";
import { WilayaService } from "@/services/wilaya.service";
import CreateWilayaDialog from "./_components/create-dialog";
import { CommunesService } from "@/services/communes.service";

export default async function Commune({ searchParams }: { searchParams: Promise<{ [key: string]: string }> }) {
  const queryParams = await searchParams;

  const data = await WilayaService.findAll(queryParams);

  const communes = await CommunesService

  if

  return (
    <div className="grid grid-cols-2 gap-[32px]">
      <SettingsView
        createDialog={<CreateWilayaDialog />}
        table={<WilayasTable data={data} />}
      />
      <SettingsView
        createDialog={<CreateWilayaDialog />}
        table={<WilayasTable data={data} />}
      />
    </div>
  );
}

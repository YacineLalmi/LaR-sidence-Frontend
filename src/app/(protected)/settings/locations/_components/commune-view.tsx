import { Card, CardContent, CardHeader } from "@/components/ui/card";
import React from "react";
import { CommuneService } from "@/services/commune.service";
import CommuneTable from "./communes-table";
import { WilayaService } from "@/services/wilaya.service";
import SelectWilayaInput from "./select-wilaya-input";
import CreateCommuneDialog from "./create-commune-dialog";
import { getTranslations } from "next-intl/server";
import { TRANSLATIONS_KEYS } from "@/i18n/translation-constants";

interface Props {
  searchParams: { [key: string]: string };
}
export default async function CommuneView({ searchParams }: Props) {
  const translation = await getTranslations();
  const { wilaya_id, communes_page } = searchParams;
  const queryParams = {
    page: communes_page ?? "1",
  };
  const selectedWilayaId = wilaya_id || "1";

  const data = await CommuneService.findByWilaya(selectedWilayaId, queryParams);
  const wilayas = await WilayaService.list();
  return (
    <Card className="bg-transparent border-none shadow-none px-0">
      <CardHeader className="px-0 flex flex-col ">
        <h1 className="text-[24px] font-bold">{translation(TRANSLATIONS_KEYS.SETTINGS.LOCATIONS.COMMUNES.TITLE)}</h1>
        <div className="flex w-full justify-between gap-2">
          <SelectWilayaInput wilayas={wilayas} selectedWilayaId={selectedWilayaId} />
          <CreateCommuneDialog wilayas={wilayas} />
        </div>
      </CardHeader>
      <CardContent className="px-0">
        <CommuneTable data={data} wilayas={wilayas} />
      </CardContent>
    </Card>
  );
}

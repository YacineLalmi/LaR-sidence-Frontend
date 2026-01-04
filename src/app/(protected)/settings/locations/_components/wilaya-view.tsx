import { Card, CardContent, CardHeader } from "@/components/ui/card";
import SearchField from "@/components/ui/search";
import React from "react";
import WilayasTable from "./wilayas-table";
import CreateWilayaDialog from "./create-wilaya-dialog";
import { WilayaService } from "@/services/wilaya.service";
import { getTranslations } from "next-intl/server";
import { TRANSLATIONS_KEYS } from "@/i18n/translation-constants";

interface Props {
  searchParams: { [key: string]: string };
}

export default async function WilayaView({ searchParams }: Props) {
  const wilayaTranslation = await getTranslations();
  const { wilayas_page, wilaya_search } = searchParams;
  const queryParams = {
    page: wilayas_page ?? "1",
    search: wilaya_search ?? "",
  };
  const data = await WilayaService.findAll(queryParams);
  return (
    <Card className="bg-transparent border-none shadow-none px-0">
      <CardHeader className="px-0 flex flex-col">
        <h1 className="text-[24px] font-bold">
          {wilayaTranslation(TRANSLATIONS_KEYS.SETTINGS.LOCATIONS.WILAYAS.TITLE)}
        </h1>
        <div className="flex w-full justify-between gap-2">
          <SearchField prefix="wilaya" />
          <CreateWilayaDialog />
        </div>
      </CardHeader>
      <CardContent className="px-0">
        <WilayasTable data={data} />
      </CardContent>
    </Card>
  );
}

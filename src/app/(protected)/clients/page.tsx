import React from "react";
import { getTranslations } from "next-intl/server";
import { ClientService } from "@/services/client.service";
import { ClientSourceService } from "@/services/client-source.service";
import { ClientStatusService } from "@/services/client-status.service";
import { ClientTypeService } from "@/services/client-types.service";
import ClientTable from "./_components/client-table";
import { TRANSLATIONS_KEYS } from "@/i18n/translation-constants";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import ClientHeader from "./_components/client-header";

export default async function Clients({ searchParams }: { searchParams: Promise<{ [key: string]: string }> }) {
  const queryParams = await searchParams;

  const clients = await ClientService.findAll(queryParams);
  const clientTypes = await ClientTypeService.list();
  const clientStatus = await ClientStatusService.list();
  const clientSources = await ClientSourceService.list();

  const civilities = [
    {
      id: "F",
      name: "Female",
    },
    {
      id: "M",
      name: "Male",
    },
    {
      id: "C",
      name: "Company",
    },
  ];
  const translation = await getTranslations();
  return (
    <Card className="bg-transparent border-none shadow-none p-0">
      <CardHeader className="px-0 flex flex-col">
        <h1 className="text-[32px] font-bold">{translation(TRANSLATIONS_KEYS.CLIENTS.TITLE)}</h1>
        <ClientHeader types={clientTypes} status={clientStatus} sources={clientSources} civilities={civilities} />
      </CardHeader>
      <CardContent className="px-0">
        <ClientTable data={clients} />
      </CardContent>
    </Card>
  );
}

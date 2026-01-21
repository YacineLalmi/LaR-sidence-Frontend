import React from "react";
import { getTranslations } from "next-intl/server";
import { DemandService } from "@/services/demand.service";
import DemandsTable from "./_components/demands-table";
import { BienService } from "@/services/bien.service";
import { UserService } from "@/services/user.service";
import { ClientService } from "@/services/client.service";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { TRANSLATIONS_KEYS } from "@/i18n/translation-constants";
import DemandsHeader from "./_components/demands-header";
import { DemandTypeService } from "@/services/demand-type.service";
import { DemandStatusService } from "@/services/demand-status.service";
import { DemandSourceService } from "@/services/demand-source.service";
import { DemandPriorityService } from "@/services/demand-priorities.service";

export default async function Demands({ searchParams }: { searchParams: Promise<{ [key: string]: string }> }) {
  const queryParams = await searchParams;

  console.log("queryParams", queryParams);

  const demands = await DemandService.findAll(queryParams);
  const types = await DemandTypeService.list().catch(() => []);
  const status = await DemandStatusService.list().catch(() => []);
  const priorities = await DemandPriorityService.list().catch(() => []);
  const sources = await DemandSourceService.list().catch(() => []);
  const clients = await ClientService.list();
  const biens = await BienService.list();
  const agents = await UserService.agentList().catch(() => []);

  const translation = await getTranslations();

  return (
    <Card className="bg-transparent border-none shadow-none p-0">
      <CardHeader className="px-0 flex flex-col">
        <h1 className="text-[32px] font-bold">{translation(TRANSLATIONS_KEYS.DEMANDS.TITLE)}</h1>
        <DemandsHeader
          types={types}
          status={status}
          priorities={priorities}
          sources={sources}
          clients={clients}
          biens={biens}
          agents={agents}
        />
      </CardHeader>
      <CardContent className="px-0">
        <DemandsTable data={demands} />
      </CardContent>
    </Card>
  );
}

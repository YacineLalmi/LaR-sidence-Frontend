import { getTranslations } from "next-intl/server";
import { DemandService } from "@/services/demand.service";
import DemandsTable from "./_components/demands-table";
import { BienService } from "@/services/bien.service";
import { UserService } from "@/services/user.service";
import { ClientService } from "@/services/client.service";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import DemandsHeader from "./_components/demands-header";
import { CATEGORIES, ClassificationService, SCOPES } from "@/services/classification.service";
import { TRANSLATIONS_KEYS_2 } from "@/i18n/translation-keys";

export default async function Demands({ searchParams }: { searchParams: Promise<{ [key: string]: string }> }) {
  const queryParams = await searchParams;

  console.log("queryParams", queryParams);

  const demands = await DemandService.findMany({ ...queryParams, include: "type,client,agent,status.color" });
  const clients = await ClientService.list();
  const biens = await BienService.list();
  const agents = await UserService.agentList().catch(() => []);

  const demandsTypes = await ClassificationService(CATEGORIES.TYPE, SCOPES.DEMAND)
    .list()
    .catch(() => []);
  const demandStatus = await ClassificationService(CATEGORIES.STATUS, SCOPES.DEMAND)
    .list()
    .catch(() => []);
  const demandPriorities = await ClassificationService(CATEGORIES.PRIORITY, SCOPES.DEMAND)
    .list()
    .catch(() => []);
  const demandSources = await ClassificationService(CATEGORIES.SOURCE, SCOPES.DEMAND)
    .list()
    .catch(() => []);

  const translation = await getTranslations();

  return (
    <Card className="bg-transparent border-none shadow-none p-0">
      <CardHeader className="px-0 flex flex-col">
        <h1 className="text-[32px] font-bold">{translation(TRANSLATIONS_KEYS_2.DEMANDS.TITLE)}</h1>
        <DemandsHeader
          types={demandsTypes}
          status={demandStatus}
          priorities={demandPriorities}
          sources={demandSources}
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

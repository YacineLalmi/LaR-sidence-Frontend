import React from "react";
import { getTranslations } from "next-intl/server";
import { DemandsService } from "@/services/demands.service";
import DemandsTable from "./_components/DemandsTable";
import { BienService } from "@/services/bien.service";
import { UserService } from "@/services/user.service";
import { ClientService } from "@/services/client.service";

export default async function Demands({ searchParams }: { searchParams: Promise<{ [key: string]: string }> }) {
  const queryParams = await searchParams;

  const demands = await DemandsService.findAll(queryParams);
  const types = await DemandsService.typesList().catch(() => []);
  const status = await DemandsService.statusList().catch(() => []);
  const priorities = await DemandsService.prioritiesList().catch(() => []);
  const sources = await DemandsService.sourcesList().catch(() => []);
  const clients = await ClientService.list();
  const biens = await BienService.list();
  const agents = await UserService.agentList().catch(() => []);

  const t = await getTranslations();

  return (
    <div className="flex flex-col gap-3">
      <div>
        <h1 className="text-2xl font-bold">{t("demands.title")}</h1>
      </div>
      <div>
        <DemandsTable
          data={demands}
          types={types}
          status={status}
          priorities={priorities}
          sources={sources}
          clients={clients}
          biens={biens}
          agents={agents}
        />
      </div>
    </div>
  );
}

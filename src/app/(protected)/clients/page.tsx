import React from "react";
import { getTranslations } from "next-intl/server";
import ClientsTable from "./_components/ClientsTable";
import { ClientsService } from "@/services/clients.service";
import { ClientSourceService } from "@/services/client-source.service";
import { ClientStatusService } from "@/services/client-status.service";
import { ClientTypeService } from "@/services/client-types.service";

export default async function Clients({ searchParams }: { searchParams: Promise<{ [key: string]: string }> }) {
  const queryParams = await searchParams;

  const clients = await ClientsService.findAll(queryParams);
  const clientTypes = await ClientTypeService.list();
  const clientStatus = await ClientStatusService.list();
  const clientSources = await ClientSourceService.list();

  const genders = [
    {
      id: "F",
      name: "Female",
    },
    {
      id: "M",
      name: "Male",
    },
  ];
  const t = await getTranslations();
  return (
    <div className="flex flex-col gap-3">
      <div>
        <h1 className="text-2xl font-bold">{t("clients.title")}</h1>
      </div>
      <div>
        <ClientsTable
          data={clients}
          types={clientTypes}
          status={clientStatus}
          sources={clientSources}
          genders={genders}
        />
      </div>
    </div>
  );
}

import React from "react";
import CreateClientForm from "./_components/create-client-form";
import { ClientStatusService } from "@/services/client-status.service";
import { ClientTypeService } from "@/services/client-types.service";
import { ClientSourceService } from "@/services/client-source.service";

export default async function ClientAdd() {
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

  return <CreateClientForm types={clientTypes} status={clientStatus} sources={clientSources} civilities={civilities} />;
}

import { ClientsService } from "@/services/clients.service";
import React from "react";
import CreateClientForm from "./_components/create-form";
import { ClientStatusService } from "@/services/client-status.service";
import { ClientTypeService } from "@/services/client-types.service";
import { ClientSourceService } from "@/services/client-source.service";

export default async function ClientAdd() {
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

  return <CreateClientForm types={clientTypes} status={clientStatus} sources={clientSources} genders={genders} />;
}

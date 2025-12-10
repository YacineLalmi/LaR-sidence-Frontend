import { ClientsService } from "@/services/clients.service";
import React from "react";
import CreateClientForm from "./_components/create-form";

export default async function ClientAdd() {
  const clientTypes = await ClientsService.typesList();
  const clientStatus = await ClientsService.statusList();
  const clientSources = await ClientsService.sourcesList();
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

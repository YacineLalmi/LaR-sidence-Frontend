import { ClientService } from "@/services/client.service";
import React from "react";
import UpdateClientForm from "./_components/update-client-form";

export default async function UpdateForm({ params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id;
  const clientTypes = await ClientService.typesList();
  const clientStatus = await ClientService.statusList();
  const clientSources = await ClientService.sourcesList();
  const client = await ClientService.findOne(id);
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

  return (
    <UpdateClientForm
      types={clientTypes}
      status={clientStatus}
      sources={clientSources}
      civilities={civilities}
      client={client}
    />
  );
}

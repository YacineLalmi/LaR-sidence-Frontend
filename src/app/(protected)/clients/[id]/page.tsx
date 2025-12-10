import { ClientsService } from "@/services/clients.service";
import React from "react";
import UpdateClientForm from "./_components/update-form";

export default async function UpdateForm({ params }: { params: { id: string } }) {
  const id = params.id;
  const clientTypes = await ClientsService.typesList();
  const clientStatus = await ClientsService.statusList();
  const clientSources = await ClientsService.sourcesList();
  const client = await ClientsService.findOne(id);
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

  return (
    <UpdateClientForm
      types={clientTypes}
      status={clientStatus}
      sources={clientSources}
      genders={genders}
      client={client}
    />
  );
}

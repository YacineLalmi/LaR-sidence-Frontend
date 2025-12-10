import React from "react";
import UpdateClientSourceForm from "./_components/update-form";
import { ClientSourceService } from "@/services/client-source.service";

export default async function BienStatusUpdatePage({ params }: { params: { id: string } }) {
  const id = params.id;
  const clientSource = await ClientSourceService.findOne(id);

  return <UpdateClientSourceForm clientSource={clientSource} />;
}

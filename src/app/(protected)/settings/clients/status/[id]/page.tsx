import React from "react";
import { ColorService } from "@/services/colors.service";
import UpdateClientStatusForm from "./_components/update-form";
import { ClientStatusService } from "@/services/client-status.service";

export default async function UpdateClientStatusPage({ params }: { params: { id: string } }) {
  const id = params.id;
  const colors = await ColorService.list();
  const clientStatus = await ClientStatusService.findOne(id);

  return <UpdateClientStatusForm colors={colors} clientStatus={clientStatus} />;
}

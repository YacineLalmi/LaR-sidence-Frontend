import React from "react";
import { ColorService } from "@/services/colors.service";
import UpdateBienStatusForm from "./_components/update-form";
import { BienStatusService } from "@/services/BienStatus.service";

export default async function UpdateClientStatusPage({ params }: { params: { id: string } }) {
  const id = parseInt(params.id);
  const colors = await ColorService.list();
  const bienStatus = await BienStatusService.findOne(id);

  return <UpdateBienStatusForm colors={colors} bienStatus={bienStatus} />;
}

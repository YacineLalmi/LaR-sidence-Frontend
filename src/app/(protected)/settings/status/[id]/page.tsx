import React from "react";
import { BienStatusService } from "@/services/BienStatus.service";
import BienStatusUpdate from "../_components/BienStatusUpdate";

export default async function BienStatusUpdatePage({ params }: { params: { id: string } }) {
  const id = parseInt(params.id);
  const status = await BienStatusService.findOne(id);

  return <BienStatusUpdate item={status} />;
}

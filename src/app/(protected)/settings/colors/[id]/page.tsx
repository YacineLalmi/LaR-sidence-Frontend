import React from "react";
import UpdateClientSourceForm from "./_components/update-form";
import { ClientSourceService } from "@/services/client-source.service";
import UpdateColorForm from "./_components/update-form";
import { ColorService } from "@/services/colors.service";

export default async function BienStatusUpdatePage({ params }: { params: { id: string } }) {
  const id = params.id;
  const color = await ColorService.findOne(id);

  return <UpdateColorForm color={color} />;
}

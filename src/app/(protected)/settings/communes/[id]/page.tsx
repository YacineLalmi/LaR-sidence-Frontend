import React from "react";
import UpdateCommuneForm from "./update-commune";
import { CommunesService } from "@/services/communes.service";
import { WilayaService } from "@/services/wilaya.service";

export default async function UtilisateurDetailPage({ params }: { params: { id: string } }) {
  const id = params.id as string;
  const commune = await CommunesService.findOne(id);
  const wilayas = await WilayaService.list();

  return <UpdateCommuneForm commune={commune} wilayas={wilayas} />;
}

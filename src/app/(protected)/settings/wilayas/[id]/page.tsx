import React from "react";
import UpdateWilayaForm from "./update-form";
import { WilayasService } from "@/services/wilayas.service";

export default async function UtilisateurDetailPage({ params }: { params: { id: string } }) {
  const id = params.id as string;
  const wilaya = await WilayasService.findOne(id);

  return <UpdateWilayaForm wilaya={wilaya} />;
}

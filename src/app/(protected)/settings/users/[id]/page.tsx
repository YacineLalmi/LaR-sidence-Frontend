import { UserService } from "@/services/users.service";
import React from "react";
import UpdateUtilisateurForm from "./update-form";
import { Card, CardHeader } from "@/components/ui/card";

export default async function UtilisateurDetailPage({ params }: { params: { id: string } }) {
  const id = params.id as string;
  const utilisateur = await UserService.findOne(id);

  return (
    <Card>
      <CardHeader>Modifier un Utilisateur</CardHeader>
      <UpdateUtilisateurForm utilisateur={utilisateur} formId="update-utilisateur" />
    </Card>
  );
}

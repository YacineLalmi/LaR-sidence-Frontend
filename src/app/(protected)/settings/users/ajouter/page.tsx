import { Card, CardHeader } from "@/components/ui/card";
import AddUtilisateurForm from "./add-form";

export default function AjouterUtilisateurPage() {
  return (
    <Card>
      <CardHeader>Ajouter un Utilisateur</CardHeader>
      <AddUtilisateurForm formId="add-utilisateur" />
    </Card>
  );
}

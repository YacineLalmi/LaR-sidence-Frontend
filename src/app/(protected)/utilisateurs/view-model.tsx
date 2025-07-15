import { CreateOrUpdateUser } from "@/schemas/utilisateur.schema";

export default function useViewModel() {
  const userInitialState: CreateOrUpdateUser = {
    nom: "",
    prenom: "",
    est_active: true,
    nom_utilisateur: "",
  };
  return {
    userInitialState,
  };
}

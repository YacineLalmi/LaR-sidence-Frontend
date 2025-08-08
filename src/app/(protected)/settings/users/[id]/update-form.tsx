"use client";
import { updateUtilisateurAction, UpdateUtilisateurState } from "@/actions/utilisateurs/update.action";
import CustomInput from "@/components/custom-input/custom-input";
import { Button } from "@/components/ui/button";
import { CardContent, CardFooter } from "@/components/ui/card";
import { customToast } from "@/lib/utils";
import { User } from "@/schemas/user.schema";
import React, { useActionState, useEffect } from "react";

interface Props {
  formId: string;
  utilisateur: User;
}

export default function UpdateUtilisateurForm({ formId, utilisateur }: Props) {
  const initialState: UpdateUtilisateurState = {
    isOk: "UNDEFINED",
    nom: utilisateur.nom,
    prenom: utilisateur.prenom,
    est_active: utilisateur.est_active,
    nom_utilisateur: utilisateur.nom_utilisateur,
    id: utilisateur.id,
  };
  const [state, formAction, isPending] = useActionState(updateUtilisateurAction, initialState);

  useEffect(() => {
    if (state.isOk === "NOK") {
      customToast.error(state.errorMessage || "");
    } else if (state.isOk === "OK") {
      customToast.success("Utilisateur modifié avec succès");
    }
  }, [state]);

  return (
    <>
      <CardContent>
        <form className="grid grid-cols-2 gap-5" action={formAction} id={formId}>
          <CustomInput
            label="Nom"
            id="nom"
            name="nom"
            value={state.nom}
            placeholder="Nom"
            disabled={isPending}
            required
            error={state.errorDetails && state.errorDetails.nom}
          />
          <CustomInput
            label="Prénom"
            id="prenom"
            name="prenom"
            value={state.prenom}
            placeholder="Prénom"
            disabled={isPending}
            required
            error={state.errorDetails && state.errorDetails.prenom}
          />
          <CustomInput
            label="Nom Utilisateur"
            id="nom_utilisateur"
            name="nom_utilisateur"
            value={state.nom_utilisateur}
            placeholder="Email"
            disabled={isPending}
            required
            error={state.errorDetails && state.errorDetails.nom_utilisateur}
          />
          <CustomInput
            label="Actif"
            id="est_active"
            name="est_active"
            type="checkbox"
            checked={state.est_active}
            disabled={isPending}
          />
          <CustomInput id="id" name="id" value={utilisateur.id} type="hidden" />
        </form>
      </CardContent>
      <CardFooter className="w-full justify-end">
        <Button className="border-1 cursor-pointer w-52 p-5" type="submit" form={formId}>
          Sauvegarder
        </Button>
      </CardFooter>
    </>
  );
}

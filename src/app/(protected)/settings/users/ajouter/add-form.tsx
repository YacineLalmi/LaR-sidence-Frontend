"use client";
import { createUtilisateurAction, CreateUtilisateurState } from "@/actions/utilisateurs/create.action";
import CustomInput from "@/components/custom-input/custom-input";
import { Button } from "@/components/ui/button";
import { CardContent, CardFooter } from "@/components/ui/card";
import { customToast } from "@/lib/utils";
import React, { useActionState, useEffect } from "react";

interface Props {
  formId: string;
}

export default function AddUtilisateurForm({ formId }: Props) {
  const initialState: CreateUtilisateurState = {
    isOk: "UNDEFINED",
    nom: "",
    prenom: "",
    est_active: true,
    nom_utilisateur: "",
  };
  const [state, formAction, isPending] = useActionState(createUtilisateurAction, initialState);

  useEffect(() => {
    if (state.isOk === "NOK") {
      customToast.error(state.errorMessage || "");
    } else if (state.isOk === "OK") {
      customToast.success("Utilisateur ajouté avec succès");
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

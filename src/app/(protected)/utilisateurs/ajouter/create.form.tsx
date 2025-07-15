"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { useActionState } from "react";
import { createAction, CreateUserState } from "../_actions/create.action";

interface Props {
  formId: string;
}

export default function CreateForm({ formId }: Props) {
  const initalState: CreateUserState = {
    isOk: "UNDEFINED",
    nom: "",
    prenom: "",
    nom_utilisateur: "",
    est_active: true,
  };
  const [state, formAction, isPending] = useActionState(createAction, initalState);
  return (
    <form className="space-y-4" action={formAction} id={formId}>
      <div className="grid gap-3">
        <Label htmlFor="nom">Nom</Label>
        <Input
          id="nom"
          defaultValue={state.nom}
          type="text"
          name="nom"
          placeholder="Nom"
          disabled={isPending}
          required
        />
        <span className="text-sm text-red-500">{state.errorDetails && state.errorDetails.nom}</span>
      </div>
      <div className="grid gap-3">
        <Label htmlFor="prenom">Code</Label>
        <Input
          id="prenom"
          defaultValue={state.prenom}
          type="text"
          name="prenom"
          placeholder="Nom de rôle"
          disabled={isPending}
          required
        />
        <span className="text-sm text-red-500">{state.errorDetails && state.errorDetails.prenom}</span>
      </div>
      <div className="grid gap-3">
        <Label htmlFor="nom_utilisateur">Code</Label>
        <Input
          id="nom_utilisateur"
          defaultValue={state.nom_utilisateur}
          type="text"
          name="nom_utilisateur"
          placeholder="nom_utilisateur"
          disabled={isPending}
          required
        />
        <span className="text-sm text-red-500">{state.errorDetails && state.errorDetails.nom_utilisateur}</span>
      </div>
    </form>
  );
}

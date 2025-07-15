"use client";
import { createRoleAction, CreateRoleState } from "@/app/(protected)/roles/_actions/create.action";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { useActionState } from "react";

interface Props {
  formId: string;
}

export default function AddRoleForm({ formId }: Props) {
  const initalState: CreateRoleState = {
    isOk: "UNDEFINED",
    name: "",
    display_name: "",
    description: "",
  };
  const [state, formAction, isPending] = useActionState(createRoleAction, initalState);
  return (
    <form className="space-y-4" action={formAction} id={formId}>
      <div className="grid gap-3">
        <Label htmlFor="name">Code</Label>
        <Input
          id="name"
          defaultValue={state.name}
          type="text"
          name="name"
          placeholder="Code de rôle"
          disabled={isPending}
          required
        />
        <span className="text-sm text-red-500">{state.errorDetails && state.errorDetails.name}</span>
      </div>
      <div className="grid gap-3">
        <Label htmlFor="display_name">Code</Label>
        <Input
          id="display_name"
          defaultValue={state.display_name}
          type="text"
          name="display_name"
          placeholder="Nom de rôle"
          disabled={isPending}
          required
        />
        <span className="text-sm text-red-500">{state.errorDetails && state.errorDetails.display_name}</span>
      </div>
      <div className="grid gap-3">
        <Label htmlFor="description">Code</Label>
        <Input
          id="description"
          defaultValue={state.description}
          type="text"
          name="description"
          placeholder="Description de rôle"
          disabled={isPending}
          required
        />
        <span className="text-sm text-red-500">{state.errorDetails && state.errorDetails.description}</span>
      </div>
    </form>
  );
}

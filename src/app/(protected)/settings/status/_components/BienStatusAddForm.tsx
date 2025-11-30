"use client";
import { createBienStatusAction, CreateBienStatusState } from "@/actions/BienStatus/create.action";
import CustomInput from "@/components/custom-inputs/custom-input copy";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ErrorCodes } from "@/lib/constants";
import { customToast } from "@/lib/utils";
import { stat } from "fs";
import { useRouter } from "next/navigation";
import React, { useActionState, useEffect } from "react";

interface Props {
  formId: string;
}

export default function BienStatusAddForm({ formId }: Props) {
  const router = useRouter();
  const initialState: CreateBienStatusState = {
    data: {
      code: "",
      name: "",
      description: "",
      is_active: true,
    },
    form: {
      isOk: true,
      errorCode: ErrorCodes.UKNOWN_ERROR,
      errorMessage: "",
    },
  };
  const [state, formAction, isPending] = useActionState(createBienStatusAction, initialState);

  useEffect(() => {
    console.log(state);
    if (!state.form.isOk) {
      customToast.error(state.form.errorMessage || "");
    } else if (state.form.isOk) {
      // TODO Add redirect to status list page

      router.push("/settings/bien/status");
      customToast.success("Status ajouté avec succès");
    }
  }, [state.form]);

  return (
    <Card className="bg-transparent shadow-none border-none">
      <CardHeader>
        <h2>Ajouter un Status</h2>
      </CardHeader>
      <CardContent>
        <form className="grid grid-cols-2 gap-5" action={formAction} id={formId}>
          <CustomInput
            label="Code"
            id="code"
            name="code"
            value={state.data.code}
            placeholder="Nom du status"
            disabled={isPending}
            required
            error={state.form.errorDetails?.code && state.form.errorDetails.code[0]}
          />
          <CustomInput
            label="Nom"
            id="name"
            name="name"
            value={state.data.name}
            placeholder="Nom du status"
            disabled={isPending}
            required
            error={state.form.errorDetails?.name && state.form.errorDetails.name[0]}
          />
          <CustomInput
            label="Description"
            id="description"
            name="description"
            value={state.data.description}
            type="textarea"
            placeholder="Description du status"
            disabled={isPending}
            required
            error={state.form.errorDetails?.description && state.form.errorDetails?.description[0]}
          />
          <CustomInput
            label="Statut"
            id="is_active"
            name="is_active"
            checked={state.data.is_active}
            type="checkbox"
            disabled={isPending}
            required
            error={state.form.errorDetails?.is_active && state.form.errorDetails.is_active[0]}
          />
          <Input type="color" id="color" name="color" value={state.data.color} disabled={isPending} required />
        </form>
      </CardContent>
      <CardFooter className="w-full justify-end">
        <Button className="border-1 cursor-pointer w-52 p-5" type="submit" form={formId}>
          Sauvegarder
        </Button>
      </CardFooter>
    </Card>
  );
}

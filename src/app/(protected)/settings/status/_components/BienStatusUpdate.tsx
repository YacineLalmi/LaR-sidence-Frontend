"use client";
import { updateBienStatusAction, UpdateBienStatusState } from "@/actions/BienStatus/update.action";
import CustomInput from "@/components/custom-inputs/input-text";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ErrorCodes } from "@/lib/constants";
import { customToast } from "@/lib/utils";
import { BienStatus } from "@/schemas/BienStatus.schema";
import React, { useActionState, useEffect } from "react";

interface Props {
  item: BienStatus;
}

export default function BienStatusUpdate({ item }: Props) {
  const initalState: UpdateBienStatusState = {
    form: {
      isOk: "UNDEFINED",
    },
    data: item,
  };
  const [state, formAction, isPending] = useActionState(updateBienStatusAction, initalState);

  useEffect(() => {
    if (state.form.isOk === "NOK" && state.form.errorCode !== ErrorCodes.VALIDATION_ERROR) {
      customToast.error(state.form.errorMessage || "");
    } else if (state.form.isOk === "OK") {
      customToast.success("Status ajouté avec succès");
    }
  }, [state.form]);

  return (
    <Card className="bg-transparent shadow-none border-none">
      <CardHeader>
        <h2>Modifier un Status de bien</h2>
      </CardHeader>
      <CardContent>
        <form className="grid grid-cols-2 gap-5" action={formAction} id="bien-type-create-form">
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
          <Input type="color" id="color" name="color" defaultValue={state.data.color} disabled={isPending} required />
          <CustomInput id="id" name="id" value={item.id} type="hidden" inputClassName="hidden" />
        </form>
      </CardContent>
      <CardFooter className="w-full justify-end">
        <Button className="border-1 cursor-pointer w-52 p-5" type="submit" form="bien-type-create-form">
          Sauvegarder
        </Button>
      </CardFooter>
    </Card>
  );
}

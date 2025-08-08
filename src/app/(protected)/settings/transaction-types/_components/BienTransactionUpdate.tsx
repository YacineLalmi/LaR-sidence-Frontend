"use client";
import { updateBienTransactionAction, UpdateBienTransactionState } from "@/actions/BienTransaction/update.action";
import CustomInput from "@/components/custom-input/custom-input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { customToast } from "@/lib/utils";
import { BienTransaction } from "@/schemas/BienTransaction.schema";
import React, { useActionState, useEffect } from "react";

interface Props {
  item: BienTransaction;
}
export default function BienTransactionUpdate({ item }: Props) {
  const initialState: UpdateBienTransactionState = {
    form: {
      isOk: "UNDEFINED",
    },
    data: item,
  };
  const [state, formAction, isPending] = useActionState(updateBienTransactionAction, initialState);

  useEffect(() => {
    if (state.form.isOk === "NOK") {
      customToast.error(state.form.errorMessage || "");
    } else if (state.form.isOk === "OK") {
      customToast.success("Transaction modifiée avec succès");
    }
  }, [state.form]);

  return (
    <Card className="bg-transparent shadow-none border-none">
      <CardHeader>
        <h2>Modifier une Transaction</h2>
      </CardHeader>
      <CardContent>
        <form className="grid grid-cols-2 gap-5" action={formAction} id="bien-transaction-update-form">
          <CustomInput
            label="Code"
            id="code"
            name="code"
            value={state.data.code}
            placeholder="Code de la transaction"
            disabled={isPending}
            required
            error={state.form.errorDetails?.code && state.form.errorDetails.code[0]}
          />
          <CustomInput
            label="Nom"
            id="name"
            name="name"
            value={state.data.name}
            placeholder="Nom de la transaction"
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
            containerClassName="col-span-2"
            placeholder="Description de la transaction"
            disabled={isPending}
            required
            error={state.form.errorDetails?.description && state.form.errorDetails.description[0]}
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
          <CustomInput id="id" name="id" value={item.id} type="hidden" inputClassName="hidden" />
        </form>
      </CardContent>
      <CardFooter className="w-full justify-end">
        <Button className="border-1 cursor-pointer w-52 p-5" type="submit" form="bien-transaction-update-form">
          Sauvegarder
        </Button>
      </CardFooter>
    </Card>
  );
}

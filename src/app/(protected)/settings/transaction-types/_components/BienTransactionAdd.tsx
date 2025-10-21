"use client";
import { createBienTransactionAction } from "@/actions/BienTransaction/create.action";
import CustomInput from "@/components/custom-inputs/input-text";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { customToast } from "@/lib/utils";
import { useActionState, useEffect } from "react";

interface Props {
  formId: string;
}
export default function BienTransactionAdd({ formId }: Props) {
  const initialState: any = {
    data: {
      code: "",
      name: "",
      description: "",
      is_active: true,
    },
    form: {
      isOk: "UNDEFINED",
      errorCode: undefined,
      errorMessage: "",
    },
  };
  const [state, formAction, isPending] = useActionState(createBienTransactionAction, initialState);

  useEffect(() => {
    if (state.form.isOk === "NOK") {
      customToast.error(state.form.errorMessage || "");
    } else if (state.form.isOk === "OK") {
      customToast.success("Transaction ajoutée avec succès");
    }
  }, [state.form]);

  return (
    <Card className="bg-transparent shadow-none border-none">
      <CardHeader>
        <h2>Ajouter une Transaction</h2>
      </CardHeader>
      <CardContent>
        <form className="grid grid-cols-2 gap-5" action={formAction} id={formId}>
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
            label="Statut"
            id="is_active"
            name="is_active"
            checked={state.data.is_active}
            type="checkbox"
            disabled={isPending}
            required
            error={state.form.errorDetails?.is_active && state.form.errorDetails.is_active[0]}
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

"use client";

import { updateClientTypeAction } from "@/actions/client-types/update.action";
import InputTextField from "@/components/custom-inputs/input-text";
import InputTextArea from "@/components/custom-inputs/input-textarea";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { customToast } from "@/lib/utils";
import { ClientTypeForm, ClientTypeFormSchema } from "@/schemas/client-types/client-type-form.schema";
import { ClientType } from "@/schemas/client-types/client-type.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";

interface Props {
  clientType: ClientType;
}

export default function UpdateClientTypeForm({ clientType }: Props) {
  const [isPending, setIsPending] = useState<boolean>(false);

  const router = useRouter();
  const t = useTranslations();

  const form = useForm<ClientTypeForm>({
    resolver: zodResolver(ClientTypeFormSchema),
    defaultValues: {
      code: clientType.code,
      name: clientType.name,
      description: clientType.description,
      is_active: clientType.is_active,
    },
  });

  async function onSubmit(values: ClientTypeForm) {
    console.log(values);
    setIsPending(true);
    try {
      const response = await updateClientTypeAction(values, clientType.id);
      setIsPending(false);
      if (response.isOk) {
        router.push("/settings/clients/types");
        customToast.success(t("common.success.operationcompleted"));
      } else customToast.error(response.errorMessage || t("common.errors.somethingwrong"));
    } catch (error) {
      console.log(error);
      customToast.error(t("common.errors.somethingwrong"));
    }
  }

  async function onInvalid(values: any) {
    const [field, error] = Object.entries(values)[0] as [string, { message: string }];
    customToast.error(`${field}: ${error.message}`);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit, onInvalid)} className="space-y-8 grid grid-cols-2 gap-5">
        <InputTextField
          control={form.control}
          name="code"
          label={t("settings.clientTypes.form.label.code")}
          disabled={isPending}
          required
          placeholder={t("settings.clientTypes.form.placeholder.code")}
        />
        <InputTextField
          control={form.control}
          name="name"
          label={t("settings.clientTypes.form.label.name")}
          disabled={isPending}
          required
          placeholder={t("settings.clientTypes.form.placeholder.name")}
        />
        <InputTextArea
          control={form.control}
          name="description"
          label={t("settings.clientTypes.form.label.description")}
          disabled={isPending}
          required
          placeholder={t("settings.clientTypes.form.placeholder.description")}
        />
        <Button className="border-1 cursor-pointer w-52 p-5 col-span-2 ml-auto" type="submit">
          {t("common.submit")}
        </Button>
      </form>
    </Form>
  );
}

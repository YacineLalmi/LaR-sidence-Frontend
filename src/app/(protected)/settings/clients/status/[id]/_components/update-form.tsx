"use client";

import { createClientStatusAction } from "@/actions/client-status/create.action";
import { updateClientStatusAction } from "@/actions/client-status/update.action";
import InputSelectField from "@/components/custom-inputs/input-select";
import InputTextField from "@/components/custom-inputs/input-text";
import InputTextArea from "@/components/custom-inputs/input-textarea";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { customToast } from "@/lib/utils";
import { ClientStatusForm, ClientStatusFormSchema } from "@/schemas/client-status/client-status-form.schema";
import { ClientStatus } from "@/schemas/client-status/client-status.schema";
import { ListItem } from "@/schemas/Global.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";

interface Props {
  colors: ListItem[];
  clientStatus: ClientStatus;
}

export default function UpdateClientStatusForm({ colors, clientStatus }: Props) {
  const [isPending, setIsPending] = useState<boolean>(false);

  const router = useRouter();
  const t = useTranslations();

  const form = useForm<ClientStatusForm>({
    resolver: zodResolver(ClientStatusFormSchema),
    defaultValues: {
      code: clientStatus.code,
      name: clientStatus.name,
      description: clientStatus.description,
      color_id: clientStatus.color.id,
      is_active: clientStatus.is_active,
    },
  });

  async function onSubmit(values: ClientStatusForm) {
    console.log(values)
    setIsPending(true);
    try {
      const response = await updateClientStatusAction(values, clientStatus.id);
      setIsPending(false);
      if (response.isOk) {
        router.push("/settings/clients/status");
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
          label={t("settings.clientStatus.form.label.code")}
          disabled={isPending}
          required
          placeholder={t("settings.clientStatus.form.placeholder.code")}
        />
        <InputTextField
          control={form.control}
          name="name"
          label={t("settings.clientStatus.form.label.name")}
          disabled={isPending}
          required
          placeholder={t("settings.clientStatus.form.placeholder.name")}
        />
        <InputTextArea
          control={form.control}
          name="description"
          label={t("settings.clientStatus.form.label.description")}
          disabled={isPending}
          required
          placeholder={t("settings.clientStatus.form.placeholder.description")}
        />
        <InputSelectField
          control={form.control}
          name="color_id"
          options={colors}
          label={t("settings.clientStatus.form.label.colorId")}
          disabled={isPending}
          required
          placeholder={t("settings.clientStatus.form.placeholder.colorId")}
        />
        <Button className="border-1 cursor-pointer w-52 p-5 col-span-2 ml-auto" type="submit">
          {t("common.submit")}
        </Button>
      </form>
    </Form>
  );
}

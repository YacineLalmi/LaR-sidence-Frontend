"use client";

import { createOfferStatusAction } from "@/actions/offer-status/create.action";
import InputSelectField from "@/components/custom-inputs/input-select";
import InputTextField from "@/components/custom-inputs/input-text";
import InputTextArea from "@/components/custom-inputs/input-textarea";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { customToast } from "@/lib/utils";
import { ListItem } from "@/schemas/Global.schema";
import { OfferStatusForm, OfferStatusFormSchema } from "@/schemas/offer-status/offer-status-form.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";

interface Props {
  colors: ListItem[];
}

export default function CreateOfferStatusForm({ colors }: Props) {
  const [isPending, setIsPending] = useState<boolean>(false);

  const router = useRouter();
  const t = useTranslations();

  const form = useForm<OfferStatusForm>({
    resolver: zodResolver(OfferStatusFormSchema),
    defaultValues: {
      code: "",
      name: "",
      description: "",
      color_id: undefined,
      is_active: true,
    },
  });

  async function onSubmit(values: OfferStatusForm) {
    setIsPending(true);
    try {
      const response = await createOfferStatusAction(values);
      setIsPending(false);
      if (response.isOk) {
        router.push("/settings/offers/status");
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
          label={t("settings.offerStatus.form.label.code")}
          disabled={isPending}
          required
          placeholder={t("settings.offerStatus.form.placeholder.code")}
        />
        <InputTextField
          control={form.control}
          name="name"
          label={t("settings.offerStatus.form.label.name")}
          disabled={isPending}
          required
          placeholder={t("settings.offerStatus.form.placeholder.name")}
        />
        <InputTextArea
          control={form.control}
          name="description"
          label={t("settings.offerStatus.form.label.description")}
          disabled={isPending}
          required
          placeholder={t("settings.offerStatus.form.placeholder.description")}
        />
        <InputSelectField
          control={form.control}
          name="color_id"
          options={colors}
          label={t("settings.offerStatus.form.label.colorId")}
          disabled={isPending}
          required
          placeholder={t("settings.offerStatus.form.placeholder.colorId")}
        />
        <Button className="border-1 cursor-pointer w-52 p-5 col-span-2 ml-auto" type="submit">
          {t("common.submit")}
        </Button>
      </form>
    </Form>
  );
}

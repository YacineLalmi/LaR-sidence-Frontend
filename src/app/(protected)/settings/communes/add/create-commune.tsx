"use client";

import { createCommuneAction } from "@/actions/commune/create.action";
import InputNumberField from "@/components/custom-inputs/input-number";
import InputSelectField from "@/components/custom-inputs/input-select";
import InputTextField from "@/components/custom-inputs/input-text";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { customToast } from "@/lib/utils";
import { CommuneForm, CommuneFormSchema } from "@/schemas/communes/commune-form.schema";
import { ListItem } from "@/schemas/Global.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";

interface Props {
  wilayas: ListItem[];
}
export default function CreateCommuneForm({ wilayas }: Props) {
  const [isPending, setIsPending] = useState<boolean>(false);
  const router = useRouter();
  const t = useTranslations();

  const form = useForm<CommuneForm>({
    resolver: zodResolver(CommuneFormSchema),
    defaultValues: {
      name: "",
      post_code: "",
      wilaya_id: "",
      longitude: undefined,
      latitude: undefined,
    },
  });

  async function onSubmit(values: CommuneForm) {
    setIsPending(true);
    try {
      const response = await createCommuneAction(values);
      setIsPending(false);
      if (response.isOk) {
        router.push("/settings/communes");
        customToast.success(t("common.success.operationcompleted"));
      } else customToast.error(response.errorMessage || t("common.errors.somethingwrong"));
    } catch (error) {
      console.log(error)
      customToast.error(t("common.errors.somethingwrong"));
    }
  }

  async function onInvalid(values: any) {
    const [field, error] = Object.entries(values)[0] as [string, { message: string }];
    customToast.error(`${field}: ${error.message}`);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit, onInvalid)} className="space-y-8 grid grid-cols-3 gap-3">
        <InputTextField
          control={form.control}
          name="name"
          label={t("settings.communes.form.label.name")}
          disabled={isPending}
          required
          placeholder={t("settings.communes.form.placeholder.name")}
        />
        <InputSelectField
          control={form.control}
          name="wilaya_id"
          label={t("biens.create.form.localisation.commune.label")}
          options={wilayas}
          placeholder={t("biens.create.form.localisation.commune.placeholder")}
          disabled={isPending}
          required
        />
        <InputTextField
          control={form.control}
          name="post_code"
          label={t("settings.communes.form.label.code")}
          disabled={isPending}
          required
          placeholder={t("settings.communes.form.placeholder.code")}
        />
        <InputNumberField
          control={form.control}
          name="longitude"
          label={t("settings.communes.form.label.longitude")}
          disabled={isPending}
          required
          placeholder={t("settings.communes.form.placeholder.longitude")}
        />
        <InputNumberField
          control={form.control}
          name="latitude"
          label={t("settings.communes.form.label.latitude")}
          disabled={isPending}
          required
          placeholder={t("settings.communes.form.placeholder.latitude")}
        />
        <Button className="border-1 cursor-pointer w-52 p-5 col-span-3 ml-auto" type="submit">
          {t("common.submit")}
        </Button>
      </form>
    </Form>
  );
}

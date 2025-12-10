"use client";

import { createWilayaAction } from "@/actions/wilayas/create.action";
import InputNumberField from "@/components/custom-inputs/input-number";
import InputTextField from "@/components/custom-inputs/input-text";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { customToast } from "@/lib/utils";
import { WilayaForm, WilayaFormSchema } from "@/schemas/wilayas/wilaya-form.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";

export default function CreateWilayaForm() {
  const [isPending, setIsPending] = useState<boolean>(false);
  const router = useRouter();
  const t = useTranslations();

  const form = useForm<WilayaForm>({
    resolver: zodResolver(WilayaFormSchema),
    defaultValues: {
      name: "",
      code: "",
      longitude: undefined,
      latitude: undefined,
    },
  });

  async function onSubmit(values: WilayaForm) {
    setIsPending(true);
    try {
      const response = await createWilayaAction(values);
      setIsPending(false);
      if (response.isOk) {
        router.push("/settings/wilayas");
        customToast.success(t("common.success.operationcompleted"));
      } else customToast.error(response.errorMessage || t("common.errors.somethingwrong"));
    } catch (error) {
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
          name="code"
          label={t("settings.wilayas.form.label.code")}
          disabled={isPending}
          required
          placeholder={t("settings.wilayas.form.placeholder.code")}
        />
        <InputTextField
          control={form.control}
          name="name"
          label={t("settings.wilayas.form.label.name")}
          disabled={isPending}
          required
          placeholder={t("settings.wilayas.form.placeholder.name")}
        />
        <InputNumberField
          control={form.control}
          name="longitude"
          label={t("settings.wilayas.form.label.longitude")}
          disabled={isPending}
          required
          placeholder={t("settings.wilayas.form.placeholder.longitude")}
        />
        <InputNumberField
          control={form.control}
          name="latitude"
          label={t("settings.wilayas.form.label.latitude")}
          disabled={isPending}
          required
          placeholder={t("settings.wilayas.form.placeholder.latitude")}
        />
        <Button className="border-1 cursor-pointer w-52 p-5 col-span-3 ml-auto" type="submit">
          {t("common.submit")}
        </Button>
      </form>
    </Form>
  );
}

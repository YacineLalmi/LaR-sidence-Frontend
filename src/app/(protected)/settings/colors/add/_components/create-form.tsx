"use client";

import { createColorAction } from "@/actions/colors/create.action";
import InputTextField from "@/components/custom-inputs/input-text";
import InputTextArea from "@/components/custom-inputs/input-textarea";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { customToast } from "@/lib/utils";
import { ClientSourceForm, ClientSourceFormSchema } from "@/schemas/client-sources/client-source-form.schema";
import { ColorForm, ColorFormSchema } from "@/schemas/colors/color-form.schema";
import { Color } from "@/schemas/colors/color.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";

export default function CreateColorForm() {
  const [isPending, setIsPending] = useState<boolean>(false);

  const router = useRouter();
  const t = useTranslations();

  const form = useForm<ColorForm>({
    resolver: zodResolver(ColorFormSchema),
    defaultValues: {
      code: "",
      name: "",
      description: "",
    },
  });

  async function onSubmit(values: ColorForm) {
    console.log(values);
    setIsPending(true);
    try {
      const response = await createColorAction(values);
      setIsPending(false);
      if (response.isOk) {
        router.push("/settings/colors");
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
          label={t("settings.colors.form.label.code")}
          disabled={isPending}
          required
          placeholder={t("settings.colors.form.placeholder.code")}
        />
        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>
                {t("settings.colors.form.label.code")} <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <div className="relative ">
                  <Input disabled={isPending} type="color" {...field} />
                </div>
              </FormControl>
            </FormItem>
          )}
        />
        <InputTextField
          control={form.control}
          name="name"
          label={t("settings.colors.form.label.name")}
          disabled={isPending}
          required
          placeholder={t("settings.colors.form.placeholder.name")}
        />
        <InputTextArea
          control={form.control}
          name="description"
          label={t("settings.colors.form.label.description")}
          disabled={isPending}
          required
          placeholder={t("settings.colors.form.placeholder.description")}
        />
        <Button className="border-1 cursor-pointer w-52 p-5 col-span-2 ml-auto" type="submit">
          {t("common.submit")}
        </Button>
      </form>
    </Form>
  );
}

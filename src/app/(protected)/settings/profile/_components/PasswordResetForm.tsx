"use client";

import { passwordResetAction } from "@/actions/Profile/PasswordReset.action";
import InputPasswordField from "@/components/custom-inputs/input-password-field";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { customToast } from "@/lib/utils";
import { PasswordResetForm as PasswordResetFormType, PasswordResetFormSchema } from "@/schemas/profile/PasswordReset.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";

export default function PasswordResetForm() {
  const [isPending, setIsPending] = useState<boolean>(false);
  const t = useTranslations();
  const router = useRouter();

  const form = useForm<PasswordResetFormType>({
    resolver: zodResolver(PasswordResetFormSchema),
    defaultValues: {
      current_password: "",
      new_password: "",
      new_password_confirmation: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: PasswordResetFormType) {
    console.log("herer")
    setIsPending(true);
    try {
      const response = await passwordResetAction(values);
      setIsPending(false);
      if (response.isOk) {
        router.push("/dashboard");
        customToast.success(t("common.success.operationcompleted"));
      } else customToast.error(response.errorMessage || t("loginFailed"));
    } catch (error) {
      customToast.error(t("common.errors.somethingwrong"));
    }
  }

  async function onInvalid(values: any) {
    console.log("error", Object.entries(values)[0]);
    const [field, error] = Object.entries(values)[0] as [string, { message: string }];
    customToast.error(`${field}: ${error.message}`);
  }

  return (
    <Card className="bg-transparent shadow-none border-none">
      <CardContent>
        <Form {...form}>
          <form id="password-rest-form" onSubmit={form.handleSubmit(onSubmit, onInvalid)} className="space-y-8 p-5">
            <InputPasswordField
              control={form.control}
              name="current_password"
              label={t("settings.profile.form.label.currentPassword")}
              disabled={isPending}
              required
              placeholder={t("settings.profile.form.placeholder.currentPassword")}
            />
            <InputPasswordField
              control={form.control}
              name="new_password"
              label={t("settings.profile.form.label.newPassword")}
              disabled={isPending}
              required
              placeholder={t("settings.profile.form.placeholder.newPassword")}
            />
            <InputPasswordField
              control={form.control}
              name="new_password_confirmation"
              label={t("settings.profile.form.label.confirmNewPassword")}
              disabled={isPending}
              required
              placeholder={t("settings.profile.form.placeholder.confirmNewPassword")}
            />
          </form>
        </Form>
      </CardContent>
      <CardFooter className="w-full justify-end">
        <Button className="border-1 cursor-pointer w-52 p-5" type="submit" form="password-rest-form">
          {t("common.submit")}
        </Button>
      </CardFooter>
    </Card>
  );
}

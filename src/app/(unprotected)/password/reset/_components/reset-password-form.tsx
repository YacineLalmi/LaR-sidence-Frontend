"use client";

import { customToast } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import MirageLoader from "@/components/mirage-loader";
import logo from "@/assests/images/logo-black.png";
import Image from "next/image";
import Link from "next/link";
import { Form, FormLabel } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { LoginFormData, LoginFormDataSchema } from "@/schemas/auth/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import InputTextField from "@/components/custom-inputs/input-text";
import { useState } from "react";
import { useTranslations } from "next-intl";
import InputPasswordField from "@/components/custom-inputs/input-password-field";
import { useRouter } from "next/navigation";
import { loginAction } from "@/actions/authentication/login.action";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { NAVIGATION_KEYS } from "@/lib/navigation-constants";
import { TRANSLATIONS_KEYS } from "@/i18n/translation-constants";
import { ResetPasswordDataForm, ResetPasswordDataFormSchema } from "@/schemas/auth/reset-password-form.schema";
import { ResetPasswordAction } from "@/actions/authentication/reset-password.action";

export function ResetPasswordForm() {
  const [isPending, setIsPending] = useState<boolean>(false);
  const translation = useTranslations();
  const router = useRouter();
  const searchParams = new URLSearchParams(window.location.search);
  const token = searchParams.get("token") || "";
  const email = searchParams.get("email") || "";

  const form = useForm<ResetPasswordDataForm>({
    resolver: zodResolver(ResetPasswordDataFormSchema),
    defaultValues: {
      email: email,
      token: token,
      password: "",
      password_confirmation: "",
    },
  });

  async function onSubmit(values: ResetPasswordDataForm) {
    console.log(values);
    setIsPending(true);
    try {
      const response = await ResetPasswordAction(values);
      if (response.isOk) {
        router.push(NAVIGATION_KEYS.DASHBOARD);
        customToast.success(translation(TRANSLATIONS_KEYS.COMMON.SUCCESS.OPERATION_COMPLETED));
      } else customToast.error(response.errorMessage || translation(TRANSLATIONS_KEYS.COMMON.ERRORS.SOMETHING_WRONG));
    } catch (error) {
      customToast.error(translation(TRANSLATIONS_KEYS.COMMON.ERRORS.SOMETHING_WRONG));
    } finally {
      setIsPending(false);
    }
  }

  return (
    <Card className="w-full bg-transparent shadow-none border-0">
      <CardHeader>
        <CardTitle className="flex justify-center items-center mb-[36px] text-[36px] ">
          Réinitialiser votre mot de passe
        </CardTitle>
        <CardDescription className="flex flex-col tracking-widest  text-black text-[16px] text-center mb-[36px]">
          Veuillez saisir un nouveau mot de passe pour votre compte.
        </CardDescription>
      </CardHeader>
      <CardContent className="my-0">
        <Form {...form}>
          <form id="reset-password-form" onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-[36px]">
            <InputPasswordField
              control={form.control}
              name="password"
              label={translation(TRANSLATIONS_KEYS.LOGIN.PASSWORD.LABEL)}
              disabled={isPending}
              required
              placeholder={translation(TRANSLATIONS_KEYS.LOGIN.PASSWORD.PLACEHOLDER)}
            />
            <InputPasswordField
              control={form.control}
              name="password_confirmation"
              label={translation(TRANSLATIONS_KEYS.LOGIN.PASSWORD.LABEL)}
              disabled={isPending}
              required
              placeholder={translation(TRANSLATIONS_KEYS.LOGIN.PASSWORD.PLACEHOLDER)}
            />
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex flex-col gap-2 mt-[24px]">
        <Button
          type="submit"
          className="w-full rounded-4xl text-xl p-6 font-light flex justify-center cursor-pointer"
          form="reset-password-form"
        >
          {isPending ? <MirageLoader /> : "Réinitialiser le mot de passe"}
        </Button>
      </CardFooter>
    </Card>
  );
}

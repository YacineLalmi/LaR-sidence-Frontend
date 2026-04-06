"use client";

import { customToast } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import MirageLoader from "@/components/mirage-loader";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useTranslations } from "next-intl";
import InputPasswordField from "@/components/custom-inputs/input-password-field";
import { useRouter } from "next/navigation";
import { NAVIGATION_KEYS } from "@/lib/navigation-constants";
import { ResetPasswordDataForm, ResetPasswordDataFormSchema } from "@/schemas/auth/reset-password-form.schema";
import { ResetPasswordAction } from "@/actions/authentication/reset-password.action";
import { TRANSLATIONS_KEYS_2 } from "@/i18n/translation-keys";

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
    setIsPending(true);
    try {
      const response = await ResetPasswordAction(values);
      if (response.isOk) {
        router.push(NAVIGATION_KEYS.DASHBOARD);
        customToast.success(translation(TRANSLATIONS_KEYS_2.COMMON.MESSAGES.OPERATION_COMPLETED));
      } else
        customToast.error(response.errorMessage || translation(TRANSLATIONS_KEYS_2.COMMON.MESSAGES.SOMETHING_WRONG));
    } catch (error) {
      customToast.error(translation(TRANSLATIONS_KEYS_2.COMMON.MESSAGES.SOMETHING_WRONG));
    } finally {
      setIsPending(false);
    }
  }

  return (
    <Card className="w-full max-w-lg bg-transparent shadow-none border-0">
      <CardHeader>
        <CardTitle className="flex justify-center items-center text-center text-md xs:text-lg sm:text-xl md:text-2xl lg:text-xl xl:text-2xl 2xl:text-3xl">
          {translation(TRANSLATIONS_KEYS_2.LOGIN.PASSWORD_RESETING)}
        </CardTitle>
        <CardDescription className="flex flex-col tracking-widest text-center font-light w-3/4 mx-auto text-xs mg:text-lg">
          {translation(TRANSLATIONS_KEYS_2.LOGIN.MESSAGES.INSERT_NEW_PASSWORD)}
        </CardDescription>
      </CardHeader>
      <CardContent className="my-0">
        <Form {...form}>
          <form id="reset-password-form" onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
            <InputPasswordField
              control={form.control}
              name="password"
              label={translation(TRANSLATIONS_KEYS_2.LOGIN.LABELS.PASSWORD)}
              disabled={isPending}
              required
              placeholder={translation(TRANSLATIONS_KEYS_2.LOGIN.PLACEHOLDERS.PASSWORD)}
            />
            <InputPasswordField
              control={form.control}
              name="password_confirmation"
              label={translation(TRANSLATIONS_KEYS_2.LOGIN.LABELS.PASSWORD_CONFIRMATION)}
              disabled={isPending}
              required
              placeholder={translation(TRANSLATIONS_KEYS_2.LOGIN.PLACEHOLDERS.PASSWORD_CONFIRMATION)}
            />
          </form>
        </Form>
      </CardContent>
      <CardFooter className="mt-6">
        <Button
          type="submit"
          className="w-full rounded-4xl text-xs sm:text-sm md:text-md lg:text-lg  p-6 font-light flex justify-center cursor-pointer"
          form="reset-password-form"
        >
          {isPending ? <MirageLoader /> : translation(TRANSLATIONS_KEYS_2.LOGIN.BUTTONS.RESET_PASSWORD)}
        </Button>
      </CardFooter>
    </Card>
  );
}

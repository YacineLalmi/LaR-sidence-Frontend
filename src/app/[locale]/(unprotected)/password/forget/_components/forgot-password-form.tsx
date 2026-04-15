"use client";

import { customToast } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import MirageLoader from "@/components/mirage-loader";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import InputTextField from "@/components/custom-inputs/input-text";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { ForgotPasswordDataForm, ForgotPasswordDataFormSchema } from "@/schemas/auth/forget-password-form.schema";
import { forgotPasswordAction } from "@/actions/authentication/forget-password.action";
import { TRANSLATIONS_KEYS_2 } from "@/i18n/translation-keys";

export function ForgetPasswordForm() {
  const [isPending, setIsPending] = useState<boolean>(false);
  const translation = useTranslations();

  const form = useForm<ForgotPasswordDataForm>({
    resolver: zodResolver(ForgotPasswordDataFormSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(values: ForgotPasswordDataForm) {
    setIsPending(true);
    try {
      const response = await forgotPasswordAction(values);
      if (response.isOk) {
        form.reset();
        customToast.success(translation(TRANSLATIONS_KEYS_2.AUTH.MESSAGES.RESET_LINK_SENT));
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
        <CardTitle className="text-center text-2xl xs:text-3xl sm:text-4xl">
          {translation(TRANSLATIONS_KEYS_2.AUTH.FORGOT_YOUR_PASSWORD)}
        </CardTitle>
        <CardDescription className="text-xs text-center w-3/4 mx-auto">
          {translation(TRANSLATIONS_KEYS_2.AUTH.MESSAGES.INSERT_YOUR_EMAIL)}
        </CardDescription>
      </CardHeader>
      <CardContent className="my-0">
        <Form {...form}>
          <form id="forget-password-form" onSubmit={form.handleSubmit(onSubmit)}>
            <InputTextField
              control={form.control}
              name="email"
              disabled={isPending}
              required
              placeholder={translation(TRANSLATIONS_KEYS_2.AUTH.PLACEHOLDERS.EMAIL)}
            />
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex flex-col gap-2 space-y-4">
        <Button
          type="submit"
          className="w-full rounded-4xl text-sm sm:text-md md:text-lg  p-6 font-light flex justify-center cursor-pointer"
          form="forget-password-form"
        >
          {isPending ? <MirageLoader /> : "Envoyer le lien"}
        </Button>
        <span className="text-xs xs:text-sm sm:text-lg text-center opacity-80">
          Vous n’avez rien reçu ? <span className="text-amber-500 cursor-pointer mr-1">Renvoyer l’email</span>
        </span>
      </CardFooter>
    </Card>
  );
}

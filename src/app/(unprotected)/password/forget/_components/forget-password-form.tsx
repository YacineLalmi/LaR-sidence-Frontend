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
import { useRouter } from "next/navigation";
import { TRANSLATIONS_KEYS } from "@/i18n/translation-constants";
import { ForgotPasswordDataForm, ForgotPasswordDataFormSchema } from "@/schemas/auth/forget-password-form.schema";
import { forgotPasswordAction } from "@/actions/authentication/forget-password.action";

export function ForgetPasswordForm() {
  const [isPending, setIsPending] = useState<boolean>(false);
  const translation = useTranslations();
  const router = useRouter();

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
        <CardTitle className="flex justify-center items-center mb-[36px] text-[36px] ">Mot de passe oublié ?</CardTitle>
        <CardDescription className="text-[16px] text-center  text-black mb-[36px]">
          Entrez votre adresse email pour recevoir un lien de réinitialisation.
        </CardDescription>
      </CardHeader>
      <CardContent className="my-0">
        <Form {...form}>
          <form id="forget-password-form" onSubmit={form.handleSubmit(onSubmit)}>
            <InputTextField control={form.control} name="email" disabled={isPending} required />
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex flex-col gap-2 mt-[36px]">
        <Button
          type="submit"
          className="w-full rounded-4xl text-xl p-6 font-light flex justify-center cursor-pointer"
          form="forget-password-form"
        >
          {isPending ? <MirageLoader /> : "Envoyer le lien"}
        </Button>
        <span className="mt-[36px] text-[16px]">
          Vous n’avez rien reçu ? <span className="text-amber-500 cursor-pointer mr-1">Renvoyer l’email</span>
        </span>
      </CardFooter>
    </Card>
  );
}

"use client";

import { customToast } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import MirageLoader from "@/components/mirage-loader";
import logo from "@/assests/images/logo-black.png";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { LoginFormData, LoginFormDataSchema } from "@/schemas/auth/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import InputTextField from "@/components/custom-inputs/input-text";
import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import InputPasswordField from "@/components/custom-inputs/input-password-field";
import { loginAction } from "@/actions/authentication/login.action";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { TRANSLATIONS_KEYS_2 } from "@/i18n/translation-keys";
import { ROUTES } from "@/constants/routes";
import { useRouter, useSearchParams } from "next/navigation";

export function LoginForm() {
  const [isPending, setIsPending] = useState<boolean>(false);
  const translation = useTranslations();
  const router = useRouter();

  const searchParams = useSearchParams();

  // 1. Extract the 'returnTo' value, or fallback to Dashboard
  const returnTo = searchParams.get("returnTo") || ROUTES.DASHBOARD;

  const form = useForm<LoginFormData>({
    resolver: zodResolver(LoginFormDataSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  async function onSubmit(values: LoginFormData) {
    setIsPending(true);
    try {
      const response = await loginAction(values);
      if (response.isOk) {
        router.push(returnTo);
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
    <Card className="w-full bg-transparent shadow-none border-0">
      <CardHeader className="px-4 sm:px-6">
        <CardTitle className="flex justify-center items-center mb-6 lg:mb-9">
          <Image src={logo} alt="logo" width={117} className="rounded-2xl w-24 md:w-28" />
        </CardTitle>
        <CardDescription className="flex flex-col tracking-tight sm:tracking-widest text-black">
          {/* Responsive Title: 2xl on mobile, 4xl on desktop */}
          <span className="text-lg xs:text-2xl tracking-widest sm:text-3xl xl:text-2xl 2xl:text-3xl 3xl:text-4xl font-bold">
            {translation(TRANSLATIONS_KEYS_2.AUTH.WELCOME)}
          </span>
          <span className="text-xs md:text-sm lg:text-lg opacity-80">Connectez-vous</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="my-0">
        <Form {...form}>
          <form id="login-form" onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-3">
            <InputTextField
              control={form.control}
              name="username"
              label={translation(TRANSLATIONS_KEYS_2.AUTH.LABELS.USERNAME)}
              disabled={isPending}
              required
              placeholder={translation(TRANSLATIONS_KEYS_2.AUTH.PLACEHOLDERS.USERNAME)}
            />
            <InputPasswordField
              control={form.control}
              name="password"
              label={translation(TRANSLATIONS_KEYS_2.AUTH.LABELS.PASSWORD)}
              disabled={isPending}
              required
              placeholder={translation(TRANSLATIONS_KEYS_2.AUTH.PLACEHOLDERS.PASSWORD)}
            />
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex flex-col gap-2 mt-[24px]">
        <div className="flex justify-between my-2 w-full">
          <div className="flex items-center gap-3">
            <Checkbox id="saveme" />
            <Label htmlFor="saveme" className="text-xs md:text-sm lg:text-base transition-all">
              {translation(TRANSLATIONS_KEYS_2.AUTH.REMEMBER_ME)}
            </Label>
          </div>
          <Link
            href={ROUTES.AUTH.FORGET_PASSWORD}
            className="text-xs md:text-sm lg:text-base hover:underline transition-all"
          >
            {translation(TRANSLATIONS_KEYS_2.AUTH.FORGOT_YOUR_PASSWORD)}
          </Link>
        </div>
        <Button
          type="submit"
          className="w-full rounded-4xl text-xl p-6 font-light flex justify-center cursor-pointer"
          form="login-form"
        >
          {isPending ? <MirageLoader /> : translation(TRANSLATIONS_KEYS_2.AUTH.BUTTONS.LOGIN)}
        </Button>
      </CardFooter>
    </Card>
  );
}

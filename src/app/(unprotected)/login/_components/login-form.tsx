"use client";

import { customToast } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import MirageLoader from "@/components/mirage-loader";
import logo from "@/assests/images/logo-black.png";
import Image from "next/image";
import Link from "next/link";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { LoginFormData, LoginFormDataSchema } from "@/schemas/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import InputTextField from "@/components/custom-inputs/input-text";
import { useState } from "react";
import { useTranslations } from "next-intl";
import InputPasswordField from "@/components/custom-inputs/input-password-field";
import { useRouter } from "next/navigation";
import { loginAction } from "@/actions/authentication/login.action";
export function LoginForm() {
  const [isPending, setIsPending] = useState<boolean>(false);
  const t = useTranslations("login");
  const router = useRouter();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(LoginFormDataSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: LoginFormData) {
    setIsPending(true);
    try {
      const response = await loginAction(values);
      setIsPending(false);
      if (response.isOk) {
        router.push("/dashboard");
        customToast.success(t("loginSuccess"));
      } else customToast.error(response.errorMessage || t("loginFailed"));
    } catch (error) {
      customToast.error(t("loginFailed"));
    }
  }

  return (
    <Card className="w-full bg-transparent shadow-none border-0">
      <CardHeader>
        <CardTitle className="flex justify-center flex-col items-center gap-2">
          <Image src={logo} alt="ss" width={50} />
        </CardTitle>
        <CardDescription className="text-3xl tracking-widest text-center text-black">{t("welcome")}</CardDescription>
      </CardHeader>
      <CardContent className="my-2">
        <Form {...form}>
          <form id="login-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <InputTextField
              control={form.control}
              name="username"
              label={t("username.label")}
              disabled={isPending}
              required
              placeholder={t("username.placeholder")}
            />
            <InputPasswordField
              control={form.control}
              name="password"
              label={t("password.label")}
              disabled={isPending}
              required
              placeholder={t("password.placeholder")}
            />
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex flex-col items-end gap-2 ">
        <div className="flex justify-end my-2">
          <Link href="#" className=" flex justify-end">
            {t("forgotYourPassword")}
          </Link>
        </div>
        <Button
          type="submit"
          className="w-full rounded-4xl text-xl p-6 font-light flex justify-center cursor-pointer"
          form="login-form"
        >
          {isPending ? <MirageLoader /> : t("submit")}
        </Button>
      </CardFooter>
    </Card>
  );
}

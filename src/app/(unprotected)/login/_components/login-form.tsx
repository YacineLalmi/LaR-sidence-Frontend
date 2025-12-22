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
import { LoginFormData, LoginFormDataSchema } from "@/schemas/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import InputTextField from "@/components/custom-inputs/input-text";
import { useState } from "react";
import { useTranslations } from "next-intl";
import InputPasswordField from "@/components/custom-inputs/input-password-field";
import { useRouter } from "next/navigation";
import { loginAction } from "@/actions/authentication/login.action";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
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
        <CardTitle className="flex justify-center items-center mb-[36px] ">
          <Image src={logo} alt="ss" width={117} className="rounded-[16px]" />
        </CardTitle>
        <CardDescription className="flex flex-col tracking-widest  text-black">
          <span className="text-[36px] font-bold">{t("welcome")}</span>
          <span>Connectez-vous</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="my-0">
        <Form {...form}>
          <form id="login-form" onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-[24px]">
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
      <CardFooter className="flex flex-col gap-2 mt-[24px]">
        <div className="flex justify-between my-2 w-full">
          <div className="flex items-center gap-3">
            <Checkbox id="saveme" />
            <Label htmlFor="saveme">Se souvenir de moi</Label>
          </div>
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

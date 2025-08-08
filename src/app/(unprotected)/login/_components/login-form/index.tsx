"use client";

import { cn, customToast } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect } from "react";
import MirageLoader from "@/components/mirage-loader";
import useViewModel from "./view-model";
import logo from "@/assests/images/logo-black.png";
import Image from "next/image";
import Link from "next/link";
export function LoginForm() {
  const { formAction, state, isPending, router } = useViewModel();


  useEffect(() => {
    if (state.form.isOk === "NOK") {
      customToast.error(state.form.errorMessage || "");
    } else if (state.form.isOk === "OK") {
      router.replace("/dashboard");
    }
  }, [state.form]);
  return (
    <Card className="w-full bg-transparent shadow-none border-0">
      <CardHeader>
        <CardTitle className="flex justify-center flex-col items-center gap-2">
          <Image src={logo} alt="ss" width={50} />
        </CardTitle>
        <CardDescription className="text-3xl tracking-widest text-center text-black">
          Bienvenue sur La Résidence
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form id="login-form" action={formAction}>
          <div className="flex flex-col gap-6">
            <div className="grid gap-3">
              <Label htmlFor="username">Nom Utilisateur</Label>
              <Input
                id="username"
                defaultValue={state.data.username}
                type="text"
                name="username"
                placeholder="User.example"
                disabled={isPending}
                required
              />
              <span className="text-sm text-red-500">{state.form.errorDetails && state.form.errorDetails.username}</span>
            </div>
            <div className="grid gap-3">
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                defaultValue={state.data.password}
                type="password"
                name="password"
                placeholder="**********"
                disabled={isPending}
                required
              />
              <span className="text-sm text-red-500">
                {state.form.errorDetails?.password && state.form.errorDetails.password}
              </span>
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col items-end gap-2 ">
        <div className="flex justify-end my-2">
          <Link href="#" className=" flex justify-end">
            Mot de passe oublié ?
          </Link>
        </div>
        <Button type="submit" className="w-full flex justify-center" form="login-form">
          {isPending ? <MirageLoader /> : "Login"}
        </Button>
      </CardFooter>
    </Card>
  );
}

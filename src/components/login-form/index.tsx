"use client";

import { cn, customToast } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect } from "react";
import MirageLoader from "@/components/mirage-loader";
import useViewModel from "./view-model";
import { Lock } from "lucide-react";
export function LoginForm() {
  const { formAction, state, isPending, router } = useViewModel();

  useEffect(() => {
    if (state.isOk === "NOK") {
      customToast.error(state.errorMessage || "");
    } else if (state.isOk === "OK") {
      router.replace("/tableau-de-bord");
    }
  }, [state]);
  return (
    <div className={cn("flex flex-col gap-6")}>
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-center">
            <Lock />
          </CardTitle>
          <CardDescription className="flex justify-center">Enter your email below to login to your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form id="login-form" action={formAction}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <Label htmlFor="nom_utilisateur">Nom Utilisateur</Label>
                <Input
                  id="nom_utilisateur"
                  defaultValue={state.nom_utilisateur}
                  type="text"
                  name="nom_utilisateur"
                  placeholder="User.example"
                  disabled={isPending}
                  required
                />
                <span className="text-sm text-red-500">{state.errorDetails?.nom_utilisateur && state.errorDetails.nom_utilisateur}</span>
              </div>
              <div className="grid gap-3">
                <Label htmlFor="mot_de_passe">mot_de_passe</Label>
                <Input
                  id="mot_de_passe"
                  defaultValue={state.mot_de_passe}
                  type="password"
                  name="mot_de_passe"
                  placeholder="**********"
                  disabled={isPending}
                  required
                />
                <span className="text-sm text-red-500">{state.errorDetails?.mot_de_passe && state.errorDetails.mot_de_passe}</span>
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col align-center">
          <Button type="submit" className="w-full flex justify-center" form="login-form">
            {isPending ? <MirageLoader /> : "Login"}
          </Button>
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
            <a href="#" className="underline underline-offset-4">
              Sign up
            </a>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

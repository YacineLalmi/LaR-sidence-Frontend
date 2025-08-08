"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  console.log(pathname);
  const t = useTranslations("settings");

  const title: Record<string, string> = {
    "/settings/wilayas": t("wilayas"),
    "/settings/communes": t("communes"),
    "/settings/users": t("users"),
    "/settings/roles": t("roles"),
    "/settings/bien-types": t("bien-types"),
    "/settings/transaction-types": t("transaction-types"),
    "/settings/status": t("status"),
    "/settings": t("settings"),
  };

  const backNavigation: Record<string, string> = {
    "/settings/wilayas": "/settings",
    "/settings/communes": "/settings",
    "/settings/users": "/settings",
    "/settings/roles": "/settings",
    "/settings/bien-types": "/settings",
    "/settings/transaction-types": "/settings",
    "/settings/status": "/settings",
    "/settings/status/add": "/settings/status",
    "/settings": "/dashboard",
  };

  return (
    <Card className="bg-transparent border-0 shadow-none p-0">
      <CardHeader className="flex gap-4 items-center">
        <Link href={backNavigation[pathname] || "/dashboard"}>
          <Button className="cursor-pointer rounded-full">
            <ArrowLeft />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">{title[pathname]}</h1>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

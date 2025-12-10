"use client";

import NavigationButton from "@/components/ui/navigation-button";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import React from "react";

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  const t = useTranslations();
  const pathname = usePathname();

  const pathsMap: Record<string, { title: string; backLink: string }> = {
    "/settings/users/add": {
      title: t("settings.users.form.title"),
      backLink: "/settings/users",
    },
    "/settings/users": {
      title: t("settings.users.title"),
      backLink: "/settings",
    },
    "/settings/roles/add": {
      title: t("settings.roles.form.title"),
      backLink: "/settings/roles",
    },
    "/settings/roles": {
      title: t("settings.roles.title"),
      backLink: "/settings",
    },
    "/settings/profile": {
      title: t("settings.profile.title"),
      backLink: "/settings",
    },
    "/settings/wilayas": {
      title: t("settings.wilayas.title"),
      backLink: "/settings",
    },
    "/settings/communes": {
      title: t("settings.communes.title"),
      backLink: "/settings",
    },
    "/settings/communes/add": {
      title: t("settings.communes.title"),
      backLink: "/settings",
    },
    
  };
  return (
    <div className="flex flex-col gap-3">
      <div className="mb-3">
        <NavigationButton title={pathsMap[pathname]?.title} backLink={pathsMap[pathname]?.backLink} />
      </div>
      <div>{children}</div>
    </div>
  );
}

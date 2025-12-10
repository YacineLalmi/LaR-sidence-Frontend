"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import SearchField from "@/components/ui/search";
import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import React from "react";

interface Props {
  moduleName: string;
  modulePath: string;
  filters?: React.ReactNode;
  table: React.ReactNode;
}

export default function SettingsView<T>({ filters, table, moduleName, modulePath }: Props) {
  const t = useTranslations();
  return (
    <Card className="bg-transparent border-none shadow-none px-0">
      <CardHeader className="px-0 flex justify-between">
        <div className="flex w-full gap-2">
          <SearchField />
          {filters}
        </div>
        <Link href={`/settings/${modulePath}/add`}>
          <Button className="cursor-pointer p-6 rounded-4xl flex gap-1 hover:bg-amber-200 hover:text-black hover:border-gray-600 border-1">
            <Plus />
            {t(`settings.${moduleName}.form.buttonText`)}
          </Button>
        </Link>
      </CardHeader>
      <CardContent className="px-0">{table}</CardContent>
    </Card>
  );
}

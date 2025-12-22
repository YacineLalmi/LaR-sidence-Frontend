"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import SearchField from "@/components/ui/search";
import { useTranslations } from "next-intl";
import React from "react";

interface Props {
  filters?: React.ReactNode;
  table: React.ReactNode;
  createDialog: React.ReactNode;
}

export default function SettingsView<T>({ filters, table, createDialog }: Props) {
  const t = useTranslations();
  return (
    <Card className="bg-transparent border-none shadow-none px-0">
      <CardHeader className="px-0 flex justify-between">
        <div className="flex w-full gap-2">
          <SearchField />
          {filters}
        </div>
        {createDialog}
      </CardHeader>
      <CardContent className="px-0">{table}</CardContent>
    </Card>
  );
}

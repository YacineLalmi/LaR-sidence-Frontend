import React from "react";
import { BienService } from "@/services/bien.service";
import { getTranslations } from "next-intl/server";
import BienTable from "./_components/bien-table";
import { TRANSLATIONS_KEYS } from "@/i18n/translation-constants";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import BienHeader from "./_components/BienHeader";

export default async function Biens({ searchParams }: { searchParams: Promise<{ [key: string]: string }> }) {
  const queryParams = await searchParams;

  const data = await BienService.findAll(queryParams);
  const translation = await getTranslations();
  return (
    <Card className="bg-transparent border-none shadow-none p-0">
      <CardHeader className="px-0 flex flex-col">
        <h1 className="text-[32px] font-bold">{translation(TRANSLATIONS_KEYS.BIENS.TITLE)}</h1>
        <BienHeader />
      </CardHeader>
      <CardContent className="px-0">
        <BienTable data={data} />
      </CardContent>
    </Card>
  );
}

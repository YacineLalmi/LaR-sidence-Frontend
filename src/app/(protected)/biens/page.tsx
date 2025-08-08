import React from "react";
import { BienTypeService } from "@/services/BienType.service";
import BienTable from "./_components/BienTable";
import { BienService } from "@/services/Bien.service";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { getTranslations } from "next-intl/server";

export default async function Biens({ searchParams }: { searchParams: Promise<{ [key: string]: string }> }) {
  const page = (await searchParams).page ?? "1";
  const perPage = (await searchParams).perPage ?? "10";
  const query = (await searchParams).query ?? "";

  const data = await BienService.findAll({ page, perPage, query });
  const t = await getTranslations("biens");
  return (
    <Card className="bg-transparent border-none shadow-none">
      <CardHeader>
        <h1 className="text-2xl font-bold">{t("management")}</h1>
      </CardHeader>
      <CardContent>
        <BienTable data={data} />
      </CardContent>
    </Card>
  );
}

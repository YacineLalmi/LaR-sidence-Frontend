import React from "react";
import BienTable from "./_components/BienTable";
import { BienService } from "@/services/Bien.service";
import { getTranslations } from "next-intl/server";

export default async function Biens({ searchParams }: { searchParams: Promise<{ [key: string]: string }> }) {
  const page = (await searchParams).page ?? "1";
  const perPage = (await searchParams).perPage ?? "10";
  const search = (await searchParams).search ?? "";

  const data = await BienService.findAll({ page, perPage, "filter[search]": search });
  const t = await getTranslations();
  return (
    <div className="flex flex-col gap-3">
      <div>
        <h1 className="text-2xl font-bold">{t("biens.management")}</h1>
      </div>
      <div>
        <BienTable data={data} />
      </div>
    </div>
  );
}

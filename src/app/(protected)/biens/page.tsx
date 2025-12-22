import React from "react";
import { BienService } from "@/services/Bien.service";
import { getTranslations } from "next-intl/server";
import BienTable from "./_components/bien-table";

export default async function Biens({ searchParams }: { searchParams: Promise<{ [key: string]: string }> }) {
  const queryParams = await searchParams;

  const data = await BienService.findAll(queryParams);
  const t = await getTranslations();
  return (
    <div className="flex flex-col gap-3">
      <div>
        <h1 className="text-[32px] font-bold">{t("biens.management")}</h1>
      </div>
      <div>
        <BienTable data={data} />
      </div>
    </div>
  );
}

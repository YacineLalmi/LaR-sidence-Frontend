import React from "react";
import { BienStatusService } from "@/services/BienStatus.service";
import BienStatusTable from "./_components/BienStatusTable";
import { getTranslations } from "next-intl/server";
import { useTranslations } from "next-intl";

export default async function BienStatusPage({ searchParams }: { searchParams: Promise<{ [key: string]: string }> }) {
  const page = (await searchParams).page ?? "1";
  const perPage = (await searchParams).perPage ?? "10";
  const query = (await searchParams).query ?? "";

  const data = await BienStatusService.findAll({ page, perPage, query });
  return <BienStatusTable data={data} />;
}

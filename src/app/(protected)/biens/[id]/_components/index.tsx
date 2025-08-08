import React from "react";
import { BienService } from "@/services/Bien.service";
import BienTable from "../../_components/BienTable";

export default async function Utilisateurs({ searchParams }: { searchParams: Promise<{ [key: string]: string }> }) {
  const page = (await searchParams).page ?? "1";
  const perPage = (await searchParams).perPage ?? "10";
  const query = (await searchParams).query ?? "";

  const data = await BienService.findAll({ page, perPage, query });
  return <BienTable data={data} />;
}

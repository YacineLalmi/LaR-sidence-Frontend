import React from "react";
import BienTypesTable from "./_components/BienTypesTable";
import { BienTypeService } from "@/services/BienType.service";

export default async function Utilisateurs({ searchParams }: { searchParams: Promise<{ [key: string]: string }> }) {
  const page = (await searchParams).page ?? "1";
  const perPage = (await searchParams).perPage ?? "10";
  const query = (await searchParams).query ?? "";

  const data = await BienTypeService.findAll({ page, perPage, query });

  return <BienTypesTable data={data} />;
}

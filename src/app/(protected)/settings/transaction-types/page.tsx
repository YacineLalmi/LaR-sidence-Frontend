import React from "react";
import BienTransactionsTable from "./_components/BienTransactionsTable";
import { BienTransactionService } from "@/services/BienTransaction.service";

export default async function BienTransactionsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string }>;
}) {
  const page = (await searchParams).page ?? "1";
  const perPage = (await searchParams).perPage ?? "10";
  const query = (await searchParams).query ?? "";

  const data = await BienTransactionService.findAll({ page, perPage, query });
  return <BienTransactionsTable data={data} />;
}

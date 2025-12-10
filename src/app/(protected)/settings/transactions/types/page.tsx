import React from "react";

import SettingsView from "@/views/settings.view";
import { TransactionTypeService } from "@/services/transaction-type.service";
import TransactionTypeTable from "./_components/transaction-type-table";

export default async function BienType({ searchParams }: { searchParams: Promise<{ [key: string]: string }> }) {
  const queryParams = await searchParams;

  const data = await TransactionTypeService.findAll(queryParams);
  return (
    <SettingsView
      moduleName="transactionTypes"
      modulePath="biens/types"
      table={<TransactionTypeTable data={data} />}
    />
  );
}

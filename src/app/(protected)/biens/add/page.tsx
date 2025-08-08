import React from "react";
import BienAdd from "../_components/BienAdd";
import { BienTypeService } from "@/services/BienType.service";
import { BienStatusService } from "@/services/BienStatus.service";
import { BienTransactionService } from "@/services/BienTransaction.service";

export default async function BienStatusAddPage() {
  const types = await BienTypeService.findAll({ page: "1", perPage: "10" });
  const status = await BienStatusService.findAll({ page: "1", perPage: "10" });
  const transactions = await BienTransactionService.findAll({ page: "1", perPage: "10" });
  return <BienAdd types={types.items} status={status.items} transactions={transactions.items} />;
}

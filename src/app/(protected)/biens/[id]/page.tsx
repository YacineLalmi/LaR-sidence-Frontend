import React from "react";
import BienUpdate from "../_components/BienUpdate";
import { BienService } from "@/services/Bien.service";
import { BienTypeService } from "@/services/BienType.service";
import { BienStatusService } from "@/services/BienStatus.service";
import { BienTransactionService } from "@/services/BienTransaction.service";

export default async function BienStatusUpdatePage({ params }: { params: { id: string } }) {
  const id = params.id;
  const biens = await BienService.findOne(id);
  const types = await BienTypeService.findAll({ page: "1", perPage: "10" });
  const status = await BienStatusService.findAll({ page: "1", perPage: "10" });
  const transactions = await BienTransactionService.findAll({ page: "1", perPage: "10" });

  return <BienUpdate item={biens} types={types.items} status={status.items} transactions={transactions.items} />;
}

import React from "react";
import { BienTransactionService } from "@/services/BienTransaction.service";
import BienTransactionUpdate from "../_components/BienTransactionUpdate";

export default async function BienTransactionUpdatePage({ params }: { params: { id: string } }) {
  const id = parseInt(params.id);
  const transaction = await BienTransactionService.findOne(id);

  return <BienTransactionUpdate item={transaction} />;
}

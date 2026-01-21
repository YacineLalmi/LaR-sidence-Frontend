"use server";

import { ListItem } from "@/schemas/global.schema";
import { TransactionTypeService } from "@/services/transaction-type.service";

export async function getTransactionTypeList(): Promise<ListItem[]> {
  try {
    return await TransactionTypeService.list();
  } catch (error) {
    console.error(error);
    return [];
  }
}

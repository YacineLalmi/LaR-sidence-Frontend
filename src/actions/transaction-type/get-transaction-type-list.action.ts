"use server";

import { ListItem } from "@/schemas/global.schema";
import { CATEGORIES, ClassificationService, SCOPES } from "@/services/classification.service";

export async function getTransactionTypeList(): Promise<ListItem[]> {
  try {
    return await ClassificationService(CATEGORIES.TYPE, SCOPES.TRANSACTION).list();
  } catch (error) {
    console.error(error);
    return [];
  }
}

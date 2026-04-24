"use server";

import { handleServerActionError } from "@/lib/server.helper";
import { ListItem } from "@/schemas/global.schema";
import { BillingModelService } from "@/services/billing-model.service";

export async function getBillingModelsListAction(needle?: string): Promise<ListItem[]> {
  try {
    return await BillingModelService.list(needle || "");
  } catch (error) {
    const result = await handleServerActionError(error);
    console.error(result)
    return [];
  }
}

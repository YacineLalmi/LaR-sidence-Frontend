"use server";

import { handleServerActionError } from "@/lib/server.helper";
import { ListItem } from "@/schemas/global.schema";
import { ClassificationService } from "@/services/classification.service";

export async function getClassificationsListAction(category: string, scope: string, needle?: string): Promise<ListItem[]> {
  try {
    return await ClassificationService(category, scope).list(needle || "");
  } catch (error) {
    const result = await handleServerActionError(error);
    console.error(result)
    return [];
  }
}

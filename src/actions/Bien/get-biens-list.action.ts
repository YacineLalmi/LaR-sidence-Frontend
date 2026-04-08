"use server";

import { handleServerActionError } from "@/lib/server.helper";
import { BienForm } from "@/schemas/biens/bien-form.schema";
import { ListItem } from "@/schemas/global.schema";
import { BienService } from "@/services/bien.service";

export async function getBienListAction(needle?: string): Promise<ListItem[]> {
  try {
    return await BienService.list(needle || "");
  } catch (error) {
    console.error("Create bien error:", error);
    const result = await handleServerActionError(error);
    return []
  }
}

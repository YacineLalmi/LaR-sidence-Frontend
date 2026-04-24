"use server";

import { handleServerActionError } from "@/lib/server.helper";
import { ListItem } from "@/schemas/global.schema";
import { ColorService } from "@/services/colors.service";

export async function getColorsListAction(needle?: string): Promise<ListItem[]> {
  try {
    return await ColorService.list(needle || "");
  } catch (error) {
    const result = await handleServerActionError(error);
    console.error(result)
    return [];
  }
}

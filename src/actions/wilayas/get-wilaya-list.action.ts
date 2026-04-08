"use server";

import { ListItem } from "@/schemas/global.schema";
import { WilayaService } from "@/services/wilaya.service";

export async function getWilayaListAction(needle?: string): Promise<ListItem[]> {
  try {
    return await WilayaService.list(needle || "");
  } catch (error) {
    console.error(error);
    return [];
  }
}

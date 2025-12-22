"use server";

import { ListItem } from "@/schemas/Global.schema";
import { ClientsService } from "@/services/clients.service";

export async function searchClientAction(needle?: string): Promise<ListItem[]> {
  try {
    const value = needle || "";
    return await ClientsService.list(value);
  } catch (error) {
    console.log(error);
    return [];
  }
}


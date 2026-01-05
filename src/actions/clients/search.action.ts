"use server";

import { ListItem } from "@/schemas/global.schema";
import { ClientService } from "@/services/client.service";

export async function searchClientAction(needle?: string): Promise<ListItem[]> {
  try {
    const value = needle || "";
    return await ClientService.list(value);
  } catch (error) {
    console.log(error);
    return [];
  }
}


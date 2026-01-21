"use server";

import { ListItem } from "@/schemas/global.schema";
import { ClientSourceService } from "@/services/client-source.service";

export async function getClientSourceList(): Promise<ListItem[]> {
  try {
    return await ClientSourceService.list();
  } catch (error) {
    console.error(error);
    return [];
  }
}

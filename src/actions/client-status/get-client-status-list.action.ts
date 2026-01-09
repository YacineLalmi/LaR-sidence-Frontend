"use server";

import { ListItem } from "@/schemas/global.schema";
import { ClientStatusService } from "@/services/client-status.service";

export async function getClientStatusList(): Promise<ListItem[]> {
  try {
    return await ClientStatusService.list();
  } catch (error) {
    console.log(error);
    return [];
  }
}

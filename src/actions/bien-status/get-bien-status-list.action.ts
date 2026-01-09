"use server";

import { ListItem } from "@/schemas/global.schema";
import { BienStatusService } from "@/services/bien-status.service";

export async function getBienStatusList(): Promise<ListItem[]> {
  try {
    return await BienStatusService.list();
  } catch (error) {
    console.log(error);
    return [];
  }
}

"use server";

import { ListItem } from "@/schemas/Global.schema";
import { CommuneService } from "@/services/commune.service";

export async function getCommuneByWilaya(wilaya_id: string): Promise<ListItem[]> {
  try {
    return await CommuneService.listByWilaya(wilaya_id);
  } catch (error) {
    console.log(error);
    return [];
  }
}

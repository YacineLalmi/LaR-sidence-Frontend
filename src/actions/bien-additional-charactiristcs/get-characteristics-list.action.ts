"use server";

import { ListItem } from "@/schemas/global.schema";
import { BienAdditionalcharacteristicsService } from "@/services/bien-additional-charactiristics.service";

export async function getCharacteristics(): Promise<ListItem[]> {
  try {
    return await BienAdditionalcharacteristicsService.list();
  } catch (error) {
    console.log(error);
    return [];
  }
}

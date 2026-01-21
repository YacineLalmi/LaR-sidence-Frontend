"use server";

import { ListItem } from "@/schemas/global.schema";
import { BienTypeService } from "@/services/bien-type.service";

export async function getBienTypeLit(): Promise<ListItem[]> {
  try {
    return await BienTypeService.list();
  } catch (error) {
    console.error(error);
    return [];
  }
}

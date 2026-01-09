"use server";

import { ListItem } from "@/schemas/global.schema";
import { ClientTypeService } from "@/services/client-types.service";

export async function getClientTypeList(): Promise<ListItem[]> {
  try {
    return await ClientTypeService.list();
  } catch (error) {
    console.log(error);
    return [];
  }
}

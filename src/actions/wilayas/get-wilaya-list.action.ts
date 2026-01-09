"use server";

import { ListItem } from "@/schemas/global.schema";
import { WilayaService } from "@/services/wilaya.service";

export async function getWilayaList(): Promise<ListItem[]> {
  try {
    return await WilayaService.list();
  } catch (error) {
    console.log(error);
    return [];
  }
}

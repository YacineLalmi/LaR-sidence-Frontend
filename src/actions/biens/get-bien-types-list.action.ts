"use server";

import ApiService from "@/services/api.service";
import { validateResponseData } from "@/lib/utils";
import { ListItem, ListItemSchema } from "@/schemas/global.schema";
import { z } from "zod";

export async function getBienTypesListAction(): Promise<ListItem[]> {
  const response = await ApiService.get<ListItem[]>({
    endpoint: "/lists/biens/types",
  });
  return validateResponseData(response.data, z.array(ListItemSchema));
}

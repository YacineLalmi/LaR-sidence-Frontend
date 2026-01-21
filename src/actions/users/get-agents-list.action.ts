"use server";

import { ListItem } from "@/schemas/global.schema";
import { UserService } from "@/services/user.service";

export async function getAgentList(): Promise<ListItem[]> {
  try {
    return await UserService.agentList();
  } catch (error) {
    console.error(error);
    return [];
  }
}

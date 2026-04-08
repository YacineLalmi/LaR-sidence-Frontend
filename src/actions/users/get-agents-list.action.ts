"use server";

import { ListItem } from "@/schemas/global.schema";
import { UserService } from "@/services/user.service";

export async function getAgentListAction(needle?: string): Promise<ListItem[]> {
  try {
    return await UserService.agentList(needle || "");
  } catch (error) {
    console.error(error);
    return [];
  }
}

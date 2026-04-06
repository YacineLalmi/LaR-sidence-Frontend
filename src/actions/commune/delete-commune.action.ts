"use server";

import { FormState } from "@/lib/definitions";
import { handleServerActionError } from "@/lib/server.helper";;
import { CommuneService } from "@/services/commune.service";

export async function deleteCommuneAction(id: string): Promise<FormState> {
  try {
    await CommuneService.delete(id);
    return { isOk: true };
  } catch (error) {
    const result = await handleServerActionError(error);
    return {
      isOk: false,
      ...result,
    };
  }
}

"use server";

import { FormState } from "@/lib/definitions";
import { handleServerActionError } from "@/lib/server.helper";
import { BienService } from "@/services/bien.service";

export async function deleteBienAction(id: string): Promise<FormState> {
  try {
    await BienService.delete(id);
    return { isOk: true };
  } catch (error) {
    const result = await handleServerActionError(error);
    return {
      isOk: false,
      ...result,
    };
  }
}

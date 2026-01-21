"use server";

import { FormState } from "@/lib/definitions";
import { handleServerActionError } from "@/lib/server.helper";
import { BienTypeService } from "@/services/bien-type.service";

export async function deleteBienTypeAction(id: number): Promise<FormState> {
  try {
    await BienTypeService.delete(id);
    return { isOk: true };
  } catch (error) {
    const result = await handleServerActionError(error);
    return {
      isOk: false,
      ...result,
    };
  }
}

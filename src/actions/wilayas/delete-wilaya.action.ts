"use server";

import { FormState } from "@/lib/definitions";
import { handleServerActionError } from "@/lib/utils";
import { WilayaService } from "@/services/wilaya.service";

export async function deleteWilayaAction(id: number): Promise<FormState> {
  try {
    await WilayaService.delete(id);
    return { isOk: true };
  } catch (error) {
    const result = handleServerActionError(error);
    return {
      isOk: false,
      ...result,
    };
  }
}

"use server";

import { FormState } from "@/lib/definitions";
import { handleServerActionError } from "@/lib/server.helper";
import { BienAdditionalcharacteristicsService } from "@/services/bien-additional-charactiristics.service";

export async function deleteBienCharacteristicsAction(id: number): Promise<FormState> {
  try {
    await BienAdditionalcharacteristicsService.delete(id);
    return { isOk: true };
  } catch (error) {
    const result = await handleServerActionError(error);
    return {
      isOk: false,
      ...result,
    };
  }
}

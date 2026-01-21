"use server";

import { FormState } from "@/lib/definitions";
import { handleServerActionError } from "@/lib/server.helper";
import { BienAdditionalcharacteristicsForm } from "@/schemas/bien-additional-characteristics/bien-additional-characteristics-form.schema";
import { BienAdditionalcharacteristicsService } from "@/services/bien-additional-charactiristics.service";

export async function createBienAdditionalCharacteristicsAction(
  data: BienAdditionalcharacteristicsForm,
): Promise<FormState> {
  try {
    await BienAdditionalcharacteristicsService.create(data);
    return { isOk: true };
  } catch (error) {
    const result = await handleServerActionError(error);
    return {
      isOk: false,
      ...result,
    };
  }
}

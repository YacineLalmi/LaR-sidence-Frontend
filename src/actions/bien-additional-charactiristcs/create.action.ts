"use server";

import { FormState } from "@/lib/definitions";
import { handleServerActionError } from "@/lib/utils";
import { BienAdditionalcharacteristicsForm } from "@/schemas/bien-additional-characteristics/bien-additional-characteristics-form.schema";
import { BienAdditionalcharacteristicsService } from "@/services/bien-additional-charactiristics.service";

export async function createBienAdditionalCharactisitcsAction(
  data: BienAdditionalcharacteristicsForm
): Promise<FormState> {
  try {
    await BienAdditionalcharacteristicsService.create(data);
    return { isOk: true };
  } catch (error) {
    const result = handleServerActionError(error);
    return {
      isOk: false,
      ...result,
    };
  }
}

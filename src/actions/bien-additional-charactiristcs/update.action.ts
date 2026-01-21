"use server";

import { FormState } from "@/lib/definitions";
import { handleServerActionError } from "@/lib/server.helper";
import { BienAdditionalcharacteristicsForm } from "@/schemas/bien-additional-characteristics/bien-additional-characteristics-form.schema";
import { BienAdditionalcharacteristicsService } from "@/services/bien-additional-charactiristics.service";

export async function updateBienAdditionalcharacteristicsAction(
  data: BienAdditionalcharacteristicsForm,
  id: number,
): Promise<FormState> {
  try {
    await BienAdditionalcharacteristicsService.update(data, id);
    return { isOk: true };
  } catch (error) {
    const result = await handleServerActionError(error);
    return {
      isOk: false,
      ...result,
    };
  }
}

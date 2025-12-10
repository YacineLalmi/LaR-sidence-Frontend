"use server";

import { FormState } from "@/lib/definitions";
import { handleServerActionError } from "@/lib/utils";
import { BienStatusForm } from "@/schemas/bien-status/bien-status-form.schema";
import { BienStatusService } from "@/services/BienStatus.service";

export async function createBienStatusAction(data: BienStatusForm): Promise<FormState> {
  try {
    await BienStatusService.create(data);
    return { isOk: true };
  } catch (error) {
    const result = handleServerActionError(error);
    return {
      isOk: false,
      ...result,
    };
  }
}

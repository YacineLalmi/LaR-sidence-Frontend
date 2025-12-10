"use server";

import { FormState } from "@/lib/definitions";
import { handleServerActionError } from "@/lib/utils";
import { BienStatusForm } from "@/schemas/bien-status/bien-status-form.schema";
import { ClientStatusForm } from "@/schemas/client-status/client-status-form.schema";
import { BienStatusService } from "@/services/BienStatus.service";
import { ClientStatusService } from "@/services/client-status.service";

export async function updateBienStatusAction(data: BienStatusForm, id: number): Promise<FormState> {
  try {
    await BienStatusService.update(data, id);
    return { isOk: true };
  } catch (error) {
    const result = handleServerActionError(error);
    return {
      isOk: false,
      ...result,
    };
  }
}

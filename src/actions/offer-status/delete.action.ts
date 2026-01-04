"use server";

import { FormState } from "@/lib/definitions";
import { handleServerActionError } from "@/lib/utils";
import { OfferStatusService } from "@/services/offer-status.service";

export async function deleteOfferStatusAction(id: number): Promise<FormState> {
  try {
    await OfferStatusService.delete(id);
    return { isOk: true };
  } catch (error) {
    const result = handleServerActionError(error);
    return {
      isOk: false,
      ...result,
    };
  }
}

"use server";

import { FormState } from "@/lib/definitions";
import { handleServerActionError } from "@/lib/utils";
import { OfferStatusForm } from "@/schemas/offer-status/offer-status-form.schema";
import { OfferStatusService } from "@/services/offer-status.service";

export async function createOfferStatusAction(data: OfferStatusForm): Promise<FormState> {
  try {
    await OfferStatusService.create(data);
    return { isOk: true };
  } catch (error) {
    const result = handleServerActionError(error);
    return {
      isOk: false,
      ...result,
    };
  }
}

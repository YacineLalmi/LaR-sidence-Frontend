"use server";

import { FormState } from "@/lib/definitions";
import { handleServerActionError } from "@/lib/utils";
import { OfferForm } from "@/schemas/offers/offer-form.schema";
import { OfferService } from "@/services/offer.service";

export async function createOfferAction(data: OfferForm): Promise<FormState> {
  try {
    await OfferService.create(data);
    return { isOk: true };
  } catch (error) {
    const result = handleServerActionError(error);
    return {
      isOk: false,
      ...result,
    };
  }
}

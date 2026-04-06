"use server";

import { FormState } from "@/lib/definitions";
import { handleServerActionError } from "@/lib/server.helper";;
import { OfferForm } from "@/schemas/offers/offer-form.schema";
import { OfferService } from "@/services/offer.service";

export async function createOfferAction(data: OfferForm): Promise<FormState> {
  try {
    await OfferService.create(data);
    return { isOk: true };
  } catch (error) {
    const result = await handleServerActionError(error);
    return {
      isOk: false,
      ...result,
    };
  }
}

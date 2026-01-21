"use server";

import { FormState } from "@/lib/definitions";
import { handleServerActionError } from "@/lib/server.helper";;
import { OfferForm } from "@/schemas/offers/offer-form.schema";
import { OfferService } from "@/services/offer.service";

export async function updateOfferAction(data: OfferForm, id: number): Promise<FormState> {
  try {
    await OfferService.update(data, id);
    return { isOk: true };
  } catch (error) {
    const result = await handleServerActionError(error);
    return {
      isOk: false,
      ...result,
    };
  }
}

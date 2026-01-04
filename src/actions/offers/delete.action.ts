"use server";

import { FormState } from "@/lib/definitions";
import { handleServerActionError } from "@/lib/utils";
import { OfferService } from "@/services/offer.service";

export async function deleteOfferAction(id: number): Promise<FormState> {
  try {
    await OfferService.delete(id);
    return { isOk: true };
  } catch (error) {
    const result = handleServerActionError(error);
    return {
      isOk: false,
      ...result,
    };
  }
}

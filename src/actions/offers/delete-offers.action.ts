"use server";

import { FormState } from "@/lib/definitions";
import { handleServerActionError } from "@/lib/server.helper";
import { OfferService } from "@/services/offer.service";

export async function deleteOffersAction(ids: string[]): Promise<FormState> {
  try {
    await OfferService.deleteMany(ids);
    return { isOk: true };
  } catch (error) {
    const result = await handleServerActionError(error);
    return {
      isOk: false,
      ...result,
    };
  }
}

"use server";

import { FormState } from "@/lib/definitions";
import { handleServerActionError } from "@/lib/server.helper";
import { OfferService } from "@/services/offer.service";

export async function deleteOfferAction(id: string): Promise<FormState> {
  try {
    await OfferService.delete(id);
    return { isOk: true };
  } catch (error) {
    const result = await handleServerActionError(error);
    return {
      isOk: false,
      ...result,
    };
  }
}

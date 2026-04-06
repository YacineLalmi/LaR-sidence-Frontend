"use server";

import { FormState } from "@/lib/definitions";
import { handleServerActionError } from "@/lib/server.helper";
import { OfferTypeService } from "@/services/offer-types.service";

export async function deleteOfferTypeAction(id: number): Promise<FormState> {
  try {
    await OfferTypeService.delete(id);
    return { isOk: true };
  } catch (error) {
    const result = await handleServerActionError(error);
    return {
      isOk: false,
      ...result,
    };
  }
}

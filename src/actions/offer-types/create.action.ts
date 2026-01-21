"use server";

import { FormState } from "@/lib/definitions";
import { handleServerActionError } from "@/lib/server.helper";;
import { OfferTypeForm } from "@/schemas/offer-type/offer-type-form.schema";
import { OfferTypeService } from "@/services/offer-types.service";

export async function createOfferTypeAction(data: OfferTypeForm): Promise<FormState> {
  try {
    await OfferTypeService.create(data);
    return { isOk: true };
  } catch (error) {
    const result = await handleServerActionError(error);
    return {
      isOk: false,
      ...result,
    };
  }
}

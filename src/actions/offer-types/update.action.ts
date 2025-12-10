"use server";

import { FormState } from "@/lib/definitions";
import { handleServerActionError } from "@/lib/utils";
import { OfferTypeForm } from "@/schemas/offer-type/offer-type-form.schema";
import { OfferTypeService } from "@/services/offer-types.service";

export async function updateOfferTypeAction(data: OfferTypeForm, id: number): Promise<FormState> {
  try {
    await OfferTypeService.update(data, id);
    return { isOk: true };
  } catch (error) {
    const result = handleServerActionError(error);
    return {
      isOk: false,
      ...result,
    };
  }
}

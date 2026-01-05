"use server";

import { FormState } from "@/lib/definitions";
import { handleServerActionError } from "@/lib/utils";
import { BienTypeService } from "@/services/bien-type.service";
import { ColorService } from "@/services/colors.service";
import { OfferTypeService } from "@/services/offer-types.service";

export async function deleteOfferTypeAction(id: number): Promise<FormState> {
  try {
    await OfferTypeService.delete(id);
    return { isOk: true };
  } catch (error) {
    const result = handleServerActionError(error);
    return {
      isOk: false,
      ...result,
    };
  }
}

"use server";

import { FormState } from "@/lib/definitions";
import { handleServerActionError } from "@/lib/utils";
import { ClientForm } from "@/schemas/clients/client-form.schema";
import { OffersService } from "@/services/offers.service";

export async function createOfferAction(data: ClientForm): Promise<FormState> {
  try {
    await OffersService.create(data);
    return { isOk: true };
  } catch (error) {
    const result = handleServerActionError(error);
    return {
      isOk: false,
      ...result,
    };
  }
}

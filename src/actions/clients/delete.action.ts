"use server";

import { FormState } from "@/lib/definitions";
import { handleServerActionError } from "@/lib/utils";
import { ClientService } from "@/services/client.service";
import { OfferStatusService } from "@/services/offer-status.service";

export async function deleteClientAction(id: number): Promise<FormState> {
  try {
    await ClientService.delete(id);
    return { isOk: true };
  } catch (error) {
    const result = handleServerActionError(error);
    return {
      isOk: false,
      ...result,
    };
  }
}

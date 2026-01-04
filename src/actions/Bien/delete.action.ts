"use server";

import { FormState } from "@/lib/definitions";
import { handleServerActionError } from "@/lib/utils";
import { BienService } from "@/services/Bien.service";
import { ClientService } from "@/services/clients.service";
import { OfferStatusService } from "@/services/offer-status.service";

export async function deleteClientAction(id: number): Promise<FormState> {
  try {
    await BienService.delete(id);
    return { isOk: true };
  } catch (error) {
    const result = handleServerActionError(error);
    return {
      isOk: false,
      ...result,
    };
  }
}

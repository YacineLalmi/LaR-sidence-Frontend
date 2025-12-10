"use server";

import { FormState } from "@/lib/definitions";
import { handleServerActionError } from "@/lib/utils";
import { ClientForm } from "@/schemas/clients/client-form.schema";
import { ClientsService } from "@/services/clients.service";

export async function createClientAction(data: ClientForm): Promise<FormState> {
  try {
    await ClientsService.create(data);
    return { isOk: true };
  } catch (error) {
    const result = handleServerActionError(error);
    return {
      isOk: false,
      ...result,
    };
  }
}

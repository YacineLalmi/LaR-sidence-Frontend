"use server";

import { FormState } from "@/lib/definitions";
import { handleServerActionError } from "@/lib/utils";
import { ClientForm } from "@/schemas/clients/client-form.schema";
import { ClientService } from "@/services/client.service";

export async function updateClientAction(data: ClientForm, id: number): Promise<FormState> {
  try {
    await ClientService.update(data, id);
    return { isOk: true };
  } catch (error) {
    const result = handleServerActionError(error);
    return {
      isOk: false,
      ...result,
    };
  }
}

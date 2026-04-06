"use server";

import { FormState } from "@/lib/definitions";
import { handleServerActionError } from "@/lib/server.helper";
import { ClientForm } from "@/schemas/clients/client-form.schema";
import { ClientService } from "@/services/client.service";

export async function updateClientAction(data: ClientForm, id: string): Promise<FormState> {
  try {
    await ClientService.update(data, id);
    return { isOk: true };
  } catch (error) {
    const result = await handleServerActionError(error);
    return {
      isOk: false,
      ...result,
    };
  }
}

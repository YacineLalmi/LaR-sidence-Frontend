"use server";

import { FormState } from "@/lib/definitions";
import { handleServerActionError } from "@/lib/server.helper";
import { ClientForm } from "@/schemas/clients/client-form.schema";
import { ClientService } from "@/services/client.service";

export async function createClientAction(data: ClientForm): Promise<FormState> {
  try {
    await ClientService.create(data);
    return { isOk: true };
  } catch (error) {
    const result = await handleServerActionError(error);
    return {
      isOk: false,
      ...result,
    };
  }
}

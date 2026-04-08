"use server";

import { FormState } from "@/lib/definitions";
import { handleServerActionError } from "@/lib/server.helper";
import { ClientForm } from "@/schemas/clients/client-form.schema";
import { Client } from "@/schemas/clients/client.schema";
import { ClientService } from "@/services/client.service";

export async function createClientAction(data: ClientForm): Promise<FormState<Client>> {
  try {
    const client = await ClientService.create(data);
    return { isOk: true, data: client };
  } catch (error) {
    const result = await handleServerActionError(error);
    return {
      isOk: false,
      ...result,
    };
  }
}

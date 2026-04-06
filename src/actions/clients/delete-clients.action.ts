"use server";

import { FormState } from "@/lib/definitions";
import { handleServerActionError } from "@/lib/server.helper";
import { ClientService } from "@/services/client.service";

export async function deleteClientsAction(ids: string[]): Promise<FormState> {
  try {
    await ClientService.deleteMany(ids);
    return { isOk: true };
  } catch (error) {
    const result = await handleServerActionError(error);
    return {
      isOk: false,
      ...result,
    };
  }
}

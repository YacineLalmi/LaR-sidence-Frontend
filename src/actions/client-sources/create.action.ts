"use server";

import { FormState } from "@/lib/definitions";
import { handleServerActionError } from "@/lib/server.helper";
import { ClientSourceForm } from "@/schemas/client-sources/client-source-form.schema";
import { ClientSourceService } from "@/services/client-source.service";

export async function createClientSourceAction(data: ClientSourceForm): Promise<FormState> {
  try {
    await ClientSourceService.create(data);
    return { isOk: true };
  } catch (error) {
    const result = await handleServerActionError(error);
    return {
      isOk: false,
      ...result,
    };
  }
}

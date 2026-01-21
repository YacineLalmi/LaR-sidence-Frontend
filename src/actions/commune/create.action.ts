"use server";

import { FormState } from "@/lib/definitions";
import { handleServerActionError } from "@/lib/server.helper";
import { CommuneForm } from "@/schemas/communes/commune-form.schema";
import { CommuneService } from "@/services/commune.service";

export async function createCommuneAction(data: CommuneForm): Promise<FormState> {
  try {
    await CommuneService.create(data);
    return { isOk: true };
  } catch (error) {
    const result = await handleServerActionError(error);
    return {
      isOk: false,
      ...result,
    };
  }
}

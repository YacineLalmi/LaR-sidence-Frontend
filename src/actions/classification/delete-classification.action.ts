"use server";

import { FormState } from "@/lib/definitions";
import { handleServerActionError } from "@/lib/server.helper";
import { ClassificationService } from "@/services/classification.service";

export async function deleteClassificationAction(category: string, scope: string, id: string): Promise<FormState> {
  try {
    await ClassificationService(category, scope).delete(id);
    return { isOk: true };
  } catch (error) {
    const result = await handleServerActionError(error);
    return {
      isOk: false,
      ...result,
    };
  }
}

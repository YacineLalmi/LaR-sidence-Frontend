"use server";

import { FormState } from "@/lib/definitions";
import { handleServerActionError } from "@/lib/server.helper";
import { ClassificationService } from "@/services/classification.service";

export async function deleteClassificationsAction(category: string, scope: string, ids: string[]): Promise<FormState> {
  try {
    await ClassificationService(category, scope).deleteMany(ids);
    return { isOk: true };
  } catch (error) {
    const result = await handleServerActionError(error);
    return {
      isOk: false,
      ...result,
    };
  }
}

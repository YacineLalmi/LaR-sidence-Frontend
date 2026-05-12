"use server";

import { FormState } from "@/lib/definitions";
import { handleServerActionError } from "@/lib/server.helper";
import { ClassificationForm } from "@/schemas/classification/classification-form.schema";
import { ClassificationService } from "@/services/classification.service";
import { revalidateTag } from "next/cache";

export async function createClassificationAction(category: string, scope: string, data: ClassificationForm): Promise<FormState> {
  try {
    await ClassificationService(category, scope).create(data);
    revalidateTag(`${category}-${scope}-classification-list`, "max")
    return { isOk: true };
  } catch (error) {
    const result = await handleServerActionError(error);
    return {
      isOk: false,
      ...result,
    };
  }
}

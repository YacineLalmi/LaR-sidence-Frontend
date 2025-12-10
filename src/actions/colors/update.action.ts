"use server";

import { FormState } from "@/lib/definitions";
import { handleServerActionError } from "@/lib/utils";
import { ColorForm } from "@/schemas/colors/color-form.schema";
import { ColorService } from "@/services/colors.service";

export async function updateColorAction(data: ColorForm, id: number): Promise<FormState> {
  try {
    await ColorService.update(data, id);
    return { isOk: true };
  } catch (error) {
    const result = handleServerActionError(error);
    return {
      isOk: false,
      ...result,
    };
  }
}

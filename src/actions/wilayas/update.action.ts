"use server";

import { FormState } from "@/lib/definitions";
import { handleServerActionError } from "@/lib/utils";
import { WilayaForm } from "@/schemas/wilayas/wilaya-form.schema";
import { WilayasService } from "@/services/wilayas.service";

export async function updateWilayaAction(data: WilayaForm, id: number): Promise<FormState> {
  try {
    await WilayasService.update(data, id);
    return { isOk: true };
  } catch (error) {
    const result = handleServerActionError(error);
    return {
      isOk: false,
      ...result,
    };
  }
}

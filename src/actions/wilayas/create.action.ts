"use server";

import { FormState } from "@/lib/definitions";
import { handleServerActionError } from "@/lib/utils";
import { WilayaForm } from "@/schemas/wilayas/wilaya-form.schema";
import { WilayaService } from "@/services/wilayas.service";

export async function createWilayaAction(data: WilayaForm): Promise<FormState> {
  try {
    await WilayaService.create(data);
    return { isOk: true };
  } catch (error) {
    const result = handleServerActionError(error);
    return {
      isOk: false,
      ...result,
    };
  }
}

"use server";

import { FormState } from "@/lib/definitions";
import { handleServerActionError } from "@/lib/server.helper";;
import { WilayaForm } from "@/schemas/wilayas/wilaya-form.schema";
import { WilayaService } from "@/services/wilaya.service";

export async function updateWilayaAction(data: WilayaForm, id: number): Promise<FormState> {
  try {
    await WilayaService.update(data, id);
    return { isOk: true };
  } catch (error) {
    const result = await handleServerActionError(error);
    return {
      isOk: false,
      ...result,
    };
  }
}

"use server";

import { FormState } from "@/lib/definitions";
import { handleServerActionError } from "@/lib/server.helper";;
import { EventTypeService } from "@/services/event-types.service";

export async function deleteEventTypeAction(id: number): Promise<FormState> {
  try {
    await EventTypeService.delete(id);
    return { isOk: true };
  } catch (error) {
    const result = await handleServerActionError(error);
    return {
      isOk: false,
      ...result,
    };
  }
}

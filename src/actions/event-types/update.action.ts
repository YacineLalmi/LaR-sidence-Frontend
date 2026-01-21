"use server";

import { FormState } from "@/lib/definitions";
import { handleServerActionError } from "@/lib/server.helper";
import { EventTypeForm } from "@/schemas/event-types/event-type-form.schema";
import { EventTypeService } from "@/services/event-types.service";

export async function updateEventTypeAction(data: EventTypeForm, id: number): Promise<FormState> {
  try {
    await EventTypeService.update(data, id);
    return { isOk: true };
  } catch (error) {
    const result = await handleServerActionError(error);
    return {
      isOk: false,
      ...result,
    };
  }
}

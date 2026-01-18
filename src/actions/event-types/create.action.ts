"use server";

import { FormState } from "@/lib/definitions";
import { handleServerActionError } from "@/lib/utils";
import { EventTypeForm } from "@/schemas/event-types/event-type-form.schema";
import { EventTypeService } from "@/services/event-types.service";

export async function createEventTypeAction(data: EventTypeForm): Promise<FormState> {
  try {
    await EventTypeService.create(data);
    return { isOk: true };
  } catch (error) {
    const result = handleServerActionError(error);
    return {
      isOk: false,
      ...result,
    };
  }
}

"use server";
import { FormState } from "@/lib/definitions";
import { EventService } from "@/services/event.service";
import { EventForm } from "@/schemas/events/event-form.schema";
import { handleServerActionError } from "@/lib/server.helper";

export async function createEventAction(data: EventForm): Promise<FormState> {
  try {
    await EventService.create(data);
    return {
      isOk: true,
    };
  } catch (error) {
    console.error("Create event error:", error);
    const result = await handleServerActionError(error);
    return {
      isOk: false,
      errorMessage: result.errorMessage,
      errorCode: result.errorCode,
    };
  }
}

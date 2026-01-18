"use server";
import { FormState } from "@/lib/definitions";
import { EventService } from "@/services/event.service";
import { handleServerActionError } from "@/lib/utils";
import { EventForm } from "@/schemas/events/event-form.schema";

export async function updateEventAction(data: EventForm, id: number): Promise<FormState> {
  try {
    await EventService.update(data, id);
    return {
      isOk: true,
    };
  } catch (error) {
    console.error("Create event error:", error);
    const result = handleServerActionError(error);
    return {
      isOk: false,
      errorMessage: result.errorMessage,
      errorCode: result.errorCode,
    };
  }
}

// Optimum Telecom Algerie (SPA)

// openssl req -newkey rsa:2048 -keyout catalogueappuat.otalgerie.com.key -out catalogueappuat.otalgerie.com.csr
// openssl req -newkey rsa:2048 -keyout cataloguewebuat.otalgerie.com.key -out cataloguewebuat.otalgerie.com.csr

// openssl req -newkey rsa:2048 -keyout customer360appuat.otalgerie.com.key -out customer360appuat.otalgerie.com.csr
// openssl req -newkey rsa:2048 -keyout customer360webuat.otalgerie.com.key -out customer360webuat.otalgerie.com.csr

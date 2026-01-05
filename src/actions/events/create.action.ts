"use server";
import { FormState } from "@/lib/definitions";
import { EventsService } from "@/services/events.service";
import { handleServerActionError } from "@/lib/utils";
import { EventForm } from "@/schemas/events/event-form.schema";

export async function createEventAction(data: EventForm): Promise<FormState> {
  try {
    // Transform the data for backend compatibility - all fields are required
    const transformedData: any = {
      title: data.title,
      description: data.description,
      start_date: data.start_date instanceof Date 
        ? data.start_date.toISOString() 
        : data.start_date,
      end_date: data.end_date instanceof Date 
        ? data.end_date.toISOString() 
        : data.end_date,
      type_id: parseInt(data.type_id),
      agent_id: parseInt(data.agent_id),
      bien_id: parseInt(data.bien_id),
      client_id: parseInt(data.client_id),
    };
    
    console.log("Creating event with data:", transformedData);
    
    await EventsService.create(transformedData);
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


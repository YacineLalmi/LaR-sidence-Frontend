import ApiService from "./api.service";
import { QueryParams } from "@/lib/definitions";
import { validateResponseData } from "@/lib/utils";
import z from "zod";
import { Event, EventSchema } from "@/schemas/events/event.schema";
import { EventForm } from "@/schemas/events/event-form.schema";

const END_POINTS = {
  findMany: "/events",
  create: "/events",
  findOne: (id: string) => `/events/${id}`,
  update: (id: string) => `/events/${id}`,
  delete: (id: string) => `/events/${id}`,
  deleteMany: `/events/many`,
};

export const EventService = {
  findMany: async (queryParams: QueryParams) => {
    const response = await ApiService.get<Event[]>({
      endpoint: END_POINTS.findMany,
      query: queryParams,
    });

    const validatedResponseData = validateResponseData<Event[]>(response.data, z.array(EventSchema));

    return {
      items: validatedResponseData,
      meta: response.meta,
    };
  },

  findOne: async (id: string) => {
    const response = await ApiService.get<Event>({
      endpoint: END_POINTS.findOne(id),
    });

    const validatedResponseData = validateResponseData<Event>(response.data, EventSchema);

    return validatedResponseData;
  },

  create: async (data: EventForm) => {
    const response = await ApiService.post<Event>({
      endpoint: END_POINTS.create,
      body: data,
    });

    const validatedResponseData = validateResponseData<Event>(response.data, EventSchema);

    return validatedResponseData;
  },

  update: async (data: EventForm, id: string) => {
    const payload = {
      ...data,
      start_date: data.start_date.toISOString(),
      end_date: data.end_date.toISOString(),
    };

    const response = await ApiService.put<Event>({
      endpoint: END_POINTS.update(id),
      body: payload,
    });

    const validatedResponseData = validateResponseData<Event>(response.data, EventSchema);

    return validatedResponseData;
  },

  delete: async (id: string) => {
    await ApiService.delete({
      endpoint: END_POINTS.delete(id),
    });
  },

  deleteMany: async (ids: string[]) => {
    await ApiService.delete({
      endpoint: END_POINTS.deleteMany,
      body: { ids }
    });
  },
};

import ApiService from "./api.service";
import { QueryParams } from "@/lib/definitions";
import { validateResponseData } from "@/lib/utils";
import { EventTypeForm } from "@/schemas/event-types/event-type-form.schema";
import { EventTypeSchema } from "@/schemas/event-types/event-type.schema";
import { EventType } from "@/schemas/events/event-type.schema";
import { ListItem, ListItemSchema } from "@/schemas/global.schema";
import z from "zod";

const END_POINTS = {
  create: "/configurations/clients/types",
  findAll: "/configurations/clients/types",
  list: "/lists/clients/types",
  findOne: (id: string) => `/configurations/clients/types/${id}`,
  update: (id: number) => `/configurations/clients/types/${id}`,
  delete: (id: number) => `/configurations/clients/types/${id}`,
};

export const EventTypeService = {
  create: async (data: EventTypeForm) => {
    const response = await ApiService.post<EventType>({
      endpoint: END_POINTS.create,
      body: data,
    });

    const validatedResponseData = validateResponseData<EventType>(response.data, EventTypeSchema);

    return validatedResponseData;
  },

  findAll: async (QueryParams: QueryParams) => {
    const response = await ApiService.get<EventType[]>({
      endpoint: END_POINTS.findAll,
      query: QueryParams,
    });

    const validatedResponseData = validateResponseData<EventType[]>(response.data, z.array(EventTypeSchema));

    return {
      items: validatedResponseData,
      meta: response.meta,
    };
  },

  list: async () => {
    const response = await ApiService.get<ListItem[]>({
      endpoint: END_POINTS.list,
    });

    
    const validatedResponseData = validateResponseData<ListItem[]>(response.data, z.array(ListItemSchema));

    return validatedResponseData;
  },

  findOne: async (id: string) => {
    const response = await ApiService.get<EventType>({
      endpoint: END_POINTS.findOne(id),
    });

    const validatedResponseData = validateResponseData<EventType>(response.data, EventTypeSchema);

    return validatedResponseData;
  },

  update: async (data: EventTypeForm, id: number) => {
    const response = await ApiService.put<EventType>({
      endpoint: END_POINTS.update(id),
      body: data,
    });

    const validatedResponseData = validateResponseData<EventType>(response.data, EventTypeSchema);

    return validatedResponseData;
  },

  delete: async (id: number) => {
    await ApiService.delete({
      endpoint: END_POINTS.delete(id),
    });
  },
};

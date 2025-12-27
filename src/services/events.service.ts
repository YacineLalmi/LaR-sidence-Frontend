import ApiService from "./api.service";
import { QueryParams } from "@/lib/definitions";
import { validateResponseData } from "@/lib/utils";
import z from "zod";
import { Event, EventSchema } from "@/schemas/events/event.schema";
import { EventType, EventTypeSchema } from "@/schemas/events/event-type.schema";
import { ListItem, ListItemSchema } from "@/schemas/Global.schema";
import { EventForm } from "@/schemas/events/event-form.schema";

const END_POINTS = {
  events: "/events",
  event: (id: string) => `/events/${id}`,
  eventTypes: "/lists/events/types",
  agents: "/lists/agents",
  clients: "/lists/clients",
  biens: "/lists/biens",
};

export const EventsService = {
  findAll: async (queryParams: QueryParams) => {
    const response = await ApiService.get<Event[]>({
      endpoint: END_POINTS.events,
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
      endpoint: END_POINTS.event(id),
    });

    const validatedResponseData = validateResponseData<Event>(response.data, EventSchema);

    return validatedResponseData;
  },

  create: async (data: EventForm) => {
    const payload = {
      ...data,
      start_date: data.start_date.toISOString(),
      end_date: data.end_date.toISOString(),
    };

    const response = await ApiService.post<Event>({
      endpoint: END_POINTS.events,
      body: payload,
    });

    const validatedResponseData = validateResponseData<Event>(response.data, EventSchema);

    return validatedResponseData;
  },

  update: async (id: string, data: EventForm) => {
    const payload = {
      ...data,
      start_date: data.start_date.toISOString(),
      end_date: data.end_date.toISOString(),
    };

    const response = await ApiService.put<Event>({
      endpoint: END_POINTS.event(id),
      body: payload,
    });

    const validatedResponseData = validateResponseData<Event>(response.data, EventSchema);

    return validatedResponseData;
  },

  delete: async (id: string) => {
    await ApiService.delete({
      endpoint: END_POINTS.event(id),
    });
  },

  getEventTypes: async (): Promise<ListItem[]> => {
    try {
      const response = await ApiService.get<ListItem[]>({
        endpoint: END_POINTS.eventTypes,
      });

      if (!response.data) {
        console.error("EventTypes response has no data:", response);
        return [];
      }

      const validatedResponseData = validateResponseData<ListItem[]>(response.data, z.array(ListItemSchema));
      return validatedResponseData;
    } catch (error) {
      console.error("Error fetching event types:", error);
      return [];
    }
  },

  getAgents: async (): Promise<ListItem[]> => {
    try {
      const response = await ApiService.get<ListItem[]>({
        endpoint: END_POINTS.agents,
      });

      if (!response.data) {
        console.error("Agents response has no data:", response);
        return [];
      }

      const validatedResponseData = validateResponseData<ListItem[]>(response.data, z.array(ListItemSchema));
      return validatedResponseData;
    } catch (error) {
      console.error("Error fetching agents:", error);
      return [];
    }
  },

  getClients: async (): Promise<ListItem[]> => {
    try {
      const response = await ApiService.get<ListItem[]>({
        endpoint: END_POINTS.clients,
      });

      if (!response.data) {
        console.error("Clients response has no data:", response);
        return [];
      }

      const validatedResponseData = validateResponseData<ListItem[]>(response.data, z.array(ListItemSchema));
      return validatedResponseData;
    } catch (error) {
      console.error("Error fetching clients:", error);
      return [];
    }
  },

  getBiens: async (): Promise<ListItem[]> => {
    try {
      const response = await ApiService.get<ListItem[]>({
        endpoint: END_POINTS.biens,
      });

      if (!response.data) {
        console.error("Biens response has no data:", response);
        return [];
      }

      const validatedResponseData = validateResponseData<ListItem[]>(response.data, z.array(ListItemSchema));
      return validatedResponseData;
    } catch (error) {
      console.error("Error fetching biens:", error);
      return [];
    }
  },
};





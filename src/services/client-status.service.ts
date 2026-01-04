import ApiService from "./api.service";
import { QueryParams } from "@/lib/definitions";
import { validateResponseData } from "@/lib/utils";
import { ClientStatusForm } from "@/schemas/client-status/client-status-form.schema";
import { ClientStatus, ClientStatusSchema } from "@/schemas/client-status/client-status.schema";
import { ListItem, ListItemSchema } from "@/schemas/Global.schema";
import z from "zod";

const END_POINTS = {
  create: "/configurations/clients/status",
  findAll: "/configurations/clients/status",
  list: "/lists/clients/status",
  findOne: (id: string) => `/configurations/clients/status/${id}`,
  update: (id: number) => `/configurations/clients/status/${id}`,
  delete: (id: number) => `/configurations/clients/status/${id}`,
};

export const ClientStatusService = {
  create: async (data: ClientStatusForm) => {
    const response = await ApiService.post<ClientStatus>({
      endpoint: END_POINTS.create,
      body: data,
    });

    const validatedResponseData = validateResponseData<ClientStatus>(response.data, ClientStatusSchema);

    return validatedResponseData;
  },

  findAll: async (QueryParams: QueryParams) => {
    const response = await ApiService.get<ClientStatus[]>({
      endpoint: END_POINTS.findAll,
      query: QueryParams,
    });

    const validatedResponseData = validateResponseData<ClientStatus[]>(response.data, z.array(ClientStatusSchema));

    return {
      items: validatedResponseData,
      meta: response.meta,
    };
  },

  list: async () => {
    const response = await ApiService.get<ListItem[]>({
      endpoint: END_POINTS.list,
    });

    console.log("response", response);
    const validatedResponseData = validateResponseData<ListItem[]>(response.data, z.array(ListItemSchema));

    return validatedResponseData;
  },

  findOne: async (id: string) => {
    const response = await ApiService.get<ClientStatus>({
      endpoint: END_POINTS.findOne(id),
    });

    const validatedResponseData = validateResponseData<ClientStatus>(response.data, ClientStatusSchema);

    return validatedResponseData;
  },

  update: async (data: ClientStatusForm, id: number) => {
    const response = await ApiService.put<ClientStatus>({
      endpoint: END_POINTS.update(id),
      body: data,
    });

    const validatedResponseData = validateResponseData<ClientStatus>(response.data, ClientStatusSchema);

    return validatedResponseData;
  },

  delete: async (id: number) => {
    await ApiService.delete({
      endpoint: END_POINTS.delete(id),
    });
  },
};

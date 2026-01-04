import ApiService from "./api.service";
import { QueryParams } from "@/lib/definitions";
import { validateResponseData } from "@/lib/utils";
import { ClientStatusForm } from "@/schemas/client-status/client-status-form.schema";
import { ClientStatus, ClientStatusSchema } from "@/schemas/client-status/client-status.schema";
import { ClientTypeForm } from "@/schemas/client-types/client-type-form.schema";
import { ClientType, ClientTypeSchema } from "@/schemas/client-types/client-type.schema";
import { ListItem, ListItemSchema } from "@/schemas/Global.schema";
import z from "zod";

const END_POINTS = {
  create: "/configurations/clients/types",
  findAll: "/configurations/clients/types",
  list: "/lists/clients/types",
  findOne: (id: string) => `/configurations/clients/types/${id}`,
  update: (id: number) => `/configurations/clients/types/${id}`,
  delete: (id: number) => `/configurations/clients/types/${id}`,
};

export const ClientTypeService = {
  create: async (data: ClientTypeForm) => {
    const response = await ApiService.post<ClientType>({
      endpoint: END_POINTS.create,
      body: data,
    });

    const validatedResponseData = validateResponseData<ClientType>(response.data, ClientTypeSchema);

    return validatedResponseData;
  },

  findAll: async (QueryParams: QueryParams) => {
    const response = await ApiService.get<ClientType[]>({
      endpoint: END_POINTS.findAll,
      query: QueryParams,
    });

    const validatedResponseData = validateResponseData<ClientType[]>(response.data, z.array(ClientTypeSchema));

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
    const response = await ApiService.get<ClientType>({
      endpoint: END_POINTS.findOne(id),
    });

    const validatedResponseData = validateResponseData<ClientType>(response.data, ClientTypeSchema);

    return validatedResponseData;
  },

  update: async (data: ClientTypeForm, id: number) => {
    const response = await ApiService.put<ClientType>({
      endpoint: END_POINTS.update(id),
      body: data,
    });

    const validatedResponseData = validateResponseData<ClientType>(response.data, ClientTypeSchema);

    return validatedResponseData;
  },

  delete: async (id: number) => {
    await ApiService.delete({
      endpoint: END_POINTS.delete(id),
    });
  },
};

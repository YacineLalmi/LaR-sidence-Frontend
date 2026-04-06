import ApiService from "./api.service";
import { QueryParams } from "@/lib/definitions";
import { validateResponseData } from "@/lib/utils";
import { ClientSourceForm } from "@/schemas/client-sources/client-source-form.schema";
import { ClientSource, ClientSourceSchema } from "@/schemas/client-sources/client-source.schema";
import { ListItem, ListItemSchema } from "@/schemas/global.schema";
import z from "zod";

const END_POINTS = {
  create: "/configurations/clients/sources",
  findAll: "/configurations/clients/sources",
  list: "/lists/clients/sources",
  findOne: (id: string) => `/configurations/clients/sources/${id}`,
  update: (id: number) => `/configurations/clients/sources/${id}`,
  delete: (id: number) => `/configurations/clients/sources/${id}`,
};

export const ClientSourceService = {
  create: async (data: ClientSourceForm) => {
    const response = await ApiService.post<ClientSource>({
      endpoint: END_POINTS.create,
      body: data,
    });

    const validatedResponseData = validateResponseData<ClientSource>(response.data, ClientSourceSchema);

    return validatedResponseData;
  },

  findAll: async (QueryParams: QueryParams) => {
    const response = await ApiService.get<ClientSource[]>({
      endpoint: END_POINTS.findAll,
      query: QueryParams,
    });

    const validatedResponseData = validateResponseData<ClientSource[]>(response.data, z.array(ClientSourceSchema));

    return {
      items: validatedResponseData,
      meta: response.meta,
    };
  },

  list: async (): Promise<ListItem[]> => {
    const response = await ApiService.get<ListItem[]>({
      endpoint: END_POINTS.list,
    });

    const validatedResponseData = validateResponseData<ListItem[]>(response.data, z.array(ListItemSchema));

    return validatedResponseData;
  },

  findOne: async (id: string) => {
    const response = await ApiService.get<ClientSource>({
      endpoint: END_POINTS.findOne(id),
    });

    const validatedResponseData = validateResponseData<ClientSource>(response.data, ClientSourceSchema);

    return validatedResponseData;
  },

  update: async (data: ClientSourceForm, id: number) => {
    const response = await ApiService.put<ClientSource>({
      endpoint: END_POINTS.update(id),
      body: data,
    });

    const validatedResponseData = validateResponseData<ClientSource>(response.data, ClientSourceSchema);

    return validatedResponseData;
  },

  delete: async (id: number) => {
    await ApiService.delete({
      endpoint: END_POINTS.delete(id),
    });
  },
};

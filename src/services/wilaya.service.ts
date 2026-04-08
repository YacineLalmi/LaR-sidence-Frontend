import ApiService from "./api.service";
import { PaginatedResponse, QueryParams } from "@/lib/definitions";
import { validateResponseData } from "@/lib/utils";
import { ListItem, ListItemSchema } from "@/schemas/global.schema";
import { WilayaForm } from "@/schemas/wilayas/wilaya-form.schema";
import { Wilaya, WilayaSchema } from "@/schemas/wilayas/wilaya.schema";
import z from "zod";

const END_POINTS = {
  create: "/configurations/wilayas",
  findMany: "/configurations/wilayas",
  list: "/lists/wilayas",
  findOne: (id: string) => `/configurations/wilayas/${id}`,
  update: (id: string) => `/configurations/wilayas/${id}`,
  delete: (id: string) => `/configurations/wilayas/${id}`,
  deleteMany: `/configurations/wilayas/many`,
};

export const WilayaService = {
  create: async (data: WilayaForm): Promise<Wilaya> => {
    const response = await ApiService.post<Wilaya>({
      endpoint: END_POINTS.create,
      body: data,
    });

    const validatedResponseData = validateResponseData<Wilaya>(response.data, WilayaSchema);

    return validatedResponseData;
  },

  findMany: async (QueryParams: QueryParams): Promise<PaginatedResponse<Wilaya>> => {
    const response = await ApiService.get<Wilaya[]>({
      endpoint: END_POINTS.findMany,
      query: QueryParams,
    });

    const validatedResponseData = validateResponseData<Wilaya[]>(response.data, z.array(WilayaSchema));

    return {
      data: validatedResponseData,
      meta: response.meta,
    };
  },

  list: async (needle: string): Promise<ListItem[]> => {
    const response = await ApiService.get<ListItem[]>({
      endpoint: END_POINTS.list,
      query: { needle }
    });


    const validatedResponseData = validateResponseData<ListItem[]>(response.data, z.array(ListItemSchema));

    return validatedResponseData;
  },

  findOne: async (id: string): Promise<Wilaya> => {
    const response = await ApiService.get<Wilaya>({
      endpoint: END_POINTS.findOne(id),
    });

    const validatedResponseData = validateResponseData<Wilaya>(response.data, WilayaSchema);

    return validatedResponseData;
  },

  update: async (data: WilayaForm, id: string): Promise<Wilaya> => {
    const response = await ApiService.put<Wilaya>({
      endpoint: END_POINTS.update(id),
      body: data,
    });

    const validatedResponseData = validateResponseData<Wilaya>(response.data, WilayaSchema);

    return validatedResponseData;
  },

  delete: async (id: string) => {
    await ApiService.delete({
      endpoint: END_POINTS.delete(id),
    });
  },

  deleteMany: async (ids: string[]): Promise<void> => {
    await ApiService.delete({
      endpoint: END_POINTS.deleteMany,
      body: { ids },
    });
  },
};

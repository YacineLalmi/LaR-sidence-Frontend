import ApiService from "./api.service";
import { QueryParams } from "@/lib/definitions";
import { validateResponseData } from "@/lib/utils";
import { ListItem, ListItemSchema } from "@/schemas/global.schema";
import { WilayaForm } from "@/schemas/wilayas/wilaya-form.schema";
import { Wilaya, WilayaSchema } from "@/schemas/wilayas/wilaya.schema";
import z from "zod";

const END_POINTS = {
  create: "/configurations/wilayas",
  findAll: "/configurations/wilayas",
  list: "/lists/wilayas",
  findOne: (id: string) => `/configurations/wilayas/${id}`,
  update: (id: string) => `/configurations/wilayas/${id}`,
  delete: (id: number) => `/configurations/wilayas/${id}`,
};

export const WilayaService = {
  create: async (data: WilayaForm) => {
    const response = await ApiService.post<Wilaya>({
      endpoint: END_POINTS.create,
      body: data,
    });

    const validatedResponseData = validateResponseData<Wilaya>(response.data, WilayaSchema);

    return validatedResponseData;
  },

  findAll: async (QueryParams: QueryParams) => {
    const response = await ApiService.get<Wilaya[]>({
      endpoint: END_POINTS.findAll,
      query: QueryParams,
    });

    const validatedResponseData = validateResponseData<Wilaya[]>(response.data, z.array(WilayaSchema));

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
    const response = await ApiService.get<Wilaya>({
      endpoint: END_POINTS.findOne(id),
    });

    const validatedResponseData = validateResponseData<Wilaya>(response.data, WilayaSchema);

    return validatedResponseData;
  },

  update: async (data: WilayaForm, id: number) => {
    const response = await ApiService.put<Wilaya>({
      endpoint: END_POINTS.update(id.toString()),
      body: data,
    });

    const validatedResponseData = validateResponseData<Wilaya>(response.data, WilayaSchema);

    return validatedResponseData;
  },

  delete: async (id: number) => {
    await ApiService.delete({
      endpoint: END_POINTS.delete(id),
    });
  },
};

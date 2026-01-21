import ApiService from "./api.service";
import { QueryParams } from "@/lib/definitions";
import { validateResponseData } from "@/lib/utils";
import { CommuneForm } from "@/schemas/communes/commune-form.schema";
import { Commune, CommuneSchema } from "@/schemas/communes/commune.schema";
import { ListItem, ListItemSchema } from "@/schemas/global.schema";
import z from "zod";

const END_POINTS = {
  create: "/configurations/communes",
  findAll: "/configurations/communes",
  findByWilaya: (wilayaId: string) => `/configurations/wilayas/${wilayaId}/communes`,
  list: "/lists/communes",
  listByWilaya: (wilayaId: string) => `/lists/wilayas/${wilayaId}/communes`,
  findOne: (id: string) => `/configurations/communes/${id}`,
  update: (id: string) => `/configurations/communes/${id}`,
  delete: (id: number) => `/configurations/communes/${id}`,
};

export const CommuneService = {
  create: async (data: CommuneForm) => {
    const response = await ApiService.post<Commune>({
      endpoint: END_POINTS.create,
      body: data,
    });
    const validatedResponseData = validateResponseData<Commune>(response.data, CommuneSchema);

    return validatedResponseData;
  },

  findAll: async (QueryParams: QueryParams) => {
    const response = await ApiService.get<Commune[]>({
      endpoint: END_POINTS.findAll,
      query: QueryParams,
    });

    const validatedResponseData = validateResponseData<Commune[]>(response.data, z.array(CommuneSchema));

    return {
      items: validatedResponseData,
      meta: response.meta,
    };
  },

  findByWilaya: async (wilaya_id: string, queryParams: QueryParams) => {
    const response = await ApiService.get<Commune[]>({
      endpoint: END_POINTS.findByWilaya(wilaya_id),
      query: queryParams,
    });

    const validatedResponseData = validateResponseData<Commune[]>(response.data, z.array(CommuneSchema));

    return {
      items: validatedResponseData,
      meta: response.meta,
    };
  },

  list: async (wilayaId?: string) => {
    const endpoint = wilayaId ? END_POINTS.list : END_POINTS.list;
    const response = await ApiService.get<ListItem[]>({
      endpoint,
    });

    const validatedResponseData = validateResponseData<ListItem[]>(response.data, z.array(ListItemSchema));

    return validatedResponseData;
  },

  listByWilaya: async (wilayaId: string) => {
    const endpoint = wilayaId ? END_POINTS.listByWilaya(wilayaId) : END_POINTS.list;
    const response = await ApiService.get<ListItem[]>({
      endpoint,
    });

    const validatedResponseData = validateResponseData<ListItem[]>(response.data, z.array(ListItemSchema));

    return validatedResponseData;
  },

  findOne: async (id: string) => {
    const response = await ApiService.get<Commune>({
      endpoint: END_POINTS.findOne(id),
    });

    const validatedResponseData = validateResponseData<Commune>(response.data, CommuneSchema);

    return validatedResponseData;
  },

  update: async (data: CommuneForm, id: number) => {
    const response = await ApiService.put<Commune>({
      endpoint: END_POINTS.update(id.toString()),
      body: data,
    });

    const validatedResponseData = validateResponseData<Commune>(response.data, CommuneSchema);

    return validatedResponseData;
  },

  delete: async (id: number) => {
    await ApiService.delete({
      endpoint: END_POINTS.delete(id),
    });
  },
};

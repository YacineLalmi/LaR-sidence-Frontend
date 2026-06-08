import ApiService from "./api.service";
import { PaginatedResponse, QueryParams } from "@/lib/definitions";
import { validateResponseData } from "@/lib/utils";

import { BienForm } from "@/schemas/biens/bien-form.schema";
import { Bien, BienSchema } from "@/schemas/biens/bien.schema";
import { ListItem, ListItemSchema } from "@/schemas/global.schema";
import z from "zod";

const END_POINTS = {
  create: "/biens",
  findMany: "/biens",
  list: "/lists/biens",
  findOne: (id: string) => `/biens/${id}`,
  update: (id: string) => `/biens/${id}`,
  delete: (id: string) => `/biens/${id}`,
  deleteMany: `/biens/many`,
};

export const BienService = {
  create: async (data: FormData) => {

    const response = await ApiService.post<Bien>({
      endpoint: END_POINTS.create,
      body: data,
    });

    const validatedResponseData = validateResponseData<Bien>(response.data, BienSchema);

    return validatedResponseData;
  },

  findMany: async (queryParams: QueryParams): Promise<PaginatedResponse<Bien>> => {
    const response = await ApiService.get<Bien[]>({
      endpoint: END_POINTS.findMany,
      query: queryParams,
    });
    const validatedResponseData = validateResponseData<Bien[]>(response.data, z.array(BienSchema));
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

  findOne: async (id: string, query?: QueryParams): Promise<Bien> => {
    const response = await ApiService.get<Bien>({
      endpoint: END_POINTS.findOne(id),
      query
    });

    const validatedResponseData = validateResponseData<Bien>(response.data, BienSchema);

    return validatedResponseData;
  },

  update: async (data: FormData, id: string): Promise<Bien> => {

    const response = await ApiService.post<Bien>({
      endpoint: END_POINTS.update(id),
      body: data,
    });

    const validatedResponseData = validateResponseData<Bien>(response.data, BienSchema);

    return validatedResponseData;
  },

  delete: async (id: string): Promise<void> => {
    await ApiService.delete({
      endpoint: END_POINTS.delete(id),
    });
  },

  deleteMany: async (ids: string[]): Promise<void> => {
    await ApiService.delete({
      endpoint: END_POINTS.deleteMany,
      body: { ids }
    });
  },
};

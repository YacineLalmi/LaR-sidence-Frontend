import ApiService from "./api.service";
import { QueryParams } from "@/lib/definitions";
import { validateResponseData } from "@/lib/utils";
import { BienType, BienTypeForm, BienTypeSchema } from "@/schemas/BienType.schema";
import { ListItem, ListItemSchema } from "@/schemas/Global.schema";
import z from "zod";

const END_POINTS = {
  create: "/configurations/biens/types",
  findAll: "/configurations/biens/types",
  list: "/lists/biens/types",
  findOne: (id: number) => `/configurations/biens/types/${id}`,
  update: (id: number) => `/configurations/biens/types/${id}`,
  delete: (id: number) => `/configurations/biens/types/${id}`,
};

export const BienTypeService = {
  create: async (data: BienTypeForm) => {
    const response = await ApiService.post<BienType>({
      endpoint: END_POINTS.create,
      body: data,
    });

    const validatedResponseData = validateResponseData<BienType>(response.data, BienTypeSchema);

    return validatedResponseData;
  },

  findAll: async (queryParams: QueryParams) => {
    const response = await ApiService.get<BienType[]>({
      endpoint: END_POINTS.findAll,
      query: queryParams,
    });

    const validatedResponseData = validateResponseData<BienType[]>(response.data, z.array(BienTypeSchema));

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

  findOne: async (id: number) => {
    const response = await ApiService.get<BienType>({
      endpoint: END_POINTS.findOne(id),
    });

    const validatedResponseData = validateResponseData<BienType>(response.data, BienTypeSchema);

    return validatedResponseData;
  },

  update: async (data: BienType, id: number) => {
    const response = await ApiService.put<BienType>({
      endpoint: END_POINTS.update(id),
      body: data,
    });

    const validatedResponseData = validateResponseData<BienType>(response.data, BienTypeSchema);

    return validatedResponseData;
  },

  delete: async (id: number) => {
    await ApiService.delete({
      endpoint: END_POINTS.delete(id),
    });
  },
};

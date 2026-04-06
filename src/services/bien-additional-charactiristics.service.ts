import ApiService from "./api.service";
import { PaginatedResponse, QueryParams } from "@/lib/definitions";
import { validateResponseData } from "@/lib/utils";
import { BienAdditionalcharacteristicsForm } from "@/schemas/bien-additional-characteristics/bien-additional-characteristics-form.schema";
import { BienAdditionalcharacteristics, BienAdditionalcharacteristicsSchema } from "@/schemas/bien-additional-characteristics/bien-addtional-characteristics.schema";
import { ListItem, ListItemSchema } from "@/schemas/global.schema";
import z from "zod";

const END_POINTS = {
  create: "/configurations/biens/characteristics",
  findAll: "/configurations/biens/characteristics",
  list: "/lists/biens/characteristics",
  findOne: (id: number) => `/configurations/biens/characteristics/${id}`,
  update: (id: number) => `/configurations/biens/characteristics/${id}`,
  delete: (id: number) => `/configurations/biens/characteristics/${id}`,
};

export const BienAdditionalcharacteristicsService = {
  create: async (data: BienAdditionalcharacteristicsForm) => {
    const response = await ApiService.post<BienAdditionalcharacteristics>({
      endpoint: END_POINTS.create,
      body: data,
    });

    const validatedResponseData = validateResponseData<BienAdditionalcharacteristics>(response.data, BienAdditionalcharacteristicsSchema);

    return validatedResponseData;
  },

  findAll: async (queryParams: QueryParams): Promise<PaginatedResponse<BienAdditionalcharacteristics>> => {
    const response = await ApiService.get<BienAdditionalcharacteristics[]>({
      endpoint: END_POINTS.findAll,
      query: queryParams,
    });

    const validatedResponseData = validateResponseData<BienAdditionalcharacteristics[]>(response.data, z.array(BienAdditionalcharacteristicsSchema));

    return {
      data: validatedResponseData,
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

  findOne: async (id: number) => {
    const response = await ApiService.get<BienAdditionalcharacteristics>({
      endpoint: END_POINTS.findOne(id),
    });

    const validatedResponseData = validateResponseData<BienAdditionalcharacteristics>(response.data, BienAdditionalcharacteristicsSchema);

    return validatedResponseData;
  },

  update: async (data: BienAdditionalcharacteristicsForm, id: number) => {
    const response = await ApiService.put<BienAdditionalcharacteristics>({
      endpoint: END_POINTS.update(id),
      body: data,
    });

    const validatedResponseData = validateResponseData<BienAdditionalcharacteristics>(response.data, BienAdditionalcharacteristicsSchema);

    return validatedResponseData;
  },

  delete: async (id: number) => {
    await ApiService.delete({
      endpoint: END_POINTS.delete(id),
    });
  },
};

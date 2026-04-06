import ApiService from "./api.service";
import { QueryParams } from "@/lib/definitions";
import { validateResponseData } from "@/lib/utils";
import { BienPriorityForm } from "@/schemas/bien-priority/bien-priority-form.schema";
import { BienPriority, BienPrioritySchema } from "@/schemas/bien-priority/bien-priotiry.schema";
import { ListItem, ListItemSchema } from "@/schemas/global.schema";
import z from "zod";

const END_POINTS = {
  create: "/configurations/demands/priorities",
  findAll: "/configurations/demands/priorities",
  list: "/lists/demands/priorities",
  findOne: (id: number) => `/configurations/demands/priorities/${id}`,
  update: (id: number) => `/configurations/demands/priorities/${id}`,
  delete: (id: number) => `/configurations/demands/priorities/${id}`,
};

export const DemandPriorityService = {
  create: async (data: BienPriorityForm) => {
    const response = await ApiService.post<BienPriority>({
      endpoint: END_POINTS.create,
      body: data,
    });

    const validatedResponseData = validateResponseData<BienPriority>(response.data, BienPrioritySchema);

    return validatedResponseData;
  },

  findAll: async (queryParams: QueryParams) => {
    const response = await ApiService.get<BienPriority[]>({
      endpoint: END_POINTS.findAll,
      query: queryParams,
    });

    const validatedResponseData = validateResponseData<BienPriority[]>(response.data, z.array(BienPrioritySchema));

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

  findOne: async (id: number) => {
    const response = await ApiService.get<BienPriority>({
      endpoint: END_POINTS.findOne(id),
    });

    const validatedResponseData = validateResponseData<BienPriority>(response.data, BienPrioritySchema);

    return validatedResponseData;
  },

  update: async (data: BienPriorityForm, id: number) => {
    const response = await ApiService.put<BienPriority>({
      endpoint: END_POINTS.update(id),
      body: data,
    });

    const validatedResponseData = validateResponseData<BienPriority>(response.data, BienPrioritySchema);

    return validatedResponseData;
  },

  delete: async (id: number) => {
    await ApiService.delete({
      endpoint: END_POINTS.delete(id),
    });
  },
};

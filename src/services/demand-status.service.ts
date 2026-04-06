import ApiService from "./api.service";
import { QueryParams } from "@/lib/definitions";
import { validateResponseData } from "@/lib/utils";
import { BienStatusForm } from "@/schemas/bien-status/bien-status-form.schema";
import { BienStatus, BienStatusSchema } from "@/schemas/bien-status/bien-status.schema";
import { ListItem, ListItemSchema } from "@/schemas/global.schema";
import z from "zod";

const END_POINTS = {
  create: "/configurations/demands/status",
  findAll: "/configurations/demands/status",
  list: "/lists/demands/status",
  findOne: (id: number) => `/configurations/demands/status/${id}`,
  update: (id: number) => `/configurations/demands/status/${id}`,
  delete: (id: number) => `/configurations/demands/status/${id}`,
};

export const DemandStatusService = {
  create: async (data: BienStatusForm) => {
    const response = await ApiService.post<BienStatus>({
      endpoint: END_POINTS.create,
      body: data,
    });

    const validatedResponseData = validateResponseData<BienStatus>(response.data, BienStatusSchema);

    return validatedResponseData;
  },

  findAll: async (queryParams: QueryParams) => {
    const response = await ApiService.get<BienStatus[]>({
      endpoint: END_POINTS.findAll,
      query: queryParams,
    });

    const validatedResponseData = validateResponseData<BienStatus[]>(response.data, z.array(BienStatusSchema));

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
    const response = await ApiService.get<BienStatus>({
      endpoint: END_POINTS.findOne(id),
    });

    const validatedResponseData = validateResponseData<BienStatus>(response.data, BienStatusSchema);

    return validatedResponseData;
  },

  update: async (data: BienStatusForm, id: number) => {
    const response = await ApiService.put<BienStatus>({
      endpoint: END_POINTS.update(id),
      body: data,
    });

    const validatedResponseData = validateResponseData<BienStatus>(response.data, BienStatusSchema);

    return validatedResponseData;
  },

  delete: async (id: number) => {
    await ApiService.delete({
      endpoint: END_POINTS.delete(id),
    });
  },
};

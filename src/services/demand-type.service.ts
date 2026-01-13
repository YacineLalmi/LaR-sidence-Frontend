import ApiService from "./api.service";
import { QueryParams } from "@/lib/definitions";
import { validateResponseData } from "@/lib/utils";
import { BienTypeForm } from "@/schemas/bien-type/bien-type-form.schema";
import { BienType, BienTypeSchema } from "@/schemas/bien-type/bien-type.schema";
import { ListItem, ListItemSchema } from "@/schemas/global.schema";
import z from "zod";

const END_POINTS = {
  create: "/configurations/demands/types",
  findAll: "/configurations/demands/types",
  list: "/lists/demands/types",
  findOne: (id: number) => `/configurations/demands/types/${id}`,
  update: (id: number) => `/configurations/demands/types/${id}`,
  delete: (id: number) => `/configurations/demands/types/${id}`,
};

export const DemandTypeService = {
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

  update: async (data: BienTypeForm, id: number) => {
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

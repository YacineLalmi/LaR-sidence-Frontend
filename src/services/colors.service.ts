import ApiService from "./api.service";
import { PaginatedResponse, QueryParams } from "@/lib/definitions";
import { validateResponseData } from "@/lib/utils";
import { ColorForm } from "@/schemas/colors/color-form.schema";
import { Color, ColorSchema } from "@/schemas/colors/color.schema";
import { ListItem, ListItemSchema } from "@/schemas/global.schema";
import z from "zod";

const END_POINTS = {
  create: "/configurations/colors",
  findMany: "/configurations/colors",
  findAll: "/configurations/colors/all",
  list: "/lists/colors",
  findOne: (id: string) => `/configurations/colors/${id}`,
  update: (id: string) => `/configurations/colors/${id}`,
  delete: (id: string) => `/configurations/colors/${id}`,
  deleteMany: (ids: string[]) => `/configurations/colors/many`,
};

export const ColorService = {

  create: async (data: ColorForm): Promise<Color> => {
    const response = await ApiService.post<Color>({
      endpoint: END_POINTS.create,
      body: data,
    });

    const validatedResponseData = validateResponseData<Color>(response.data, ColorSchema);

    return validatedResponseData;
  },

  findMany: async (QueryParams: QueryParams): Promise<PaginatedResponse<Color>> => {
    const response = await ApiService.get<Color[]>({
      endpoint: END_POINTS.findMany,
      query: QueryParams,
    });

    const validatedResponseData = validateResponseData<Color[]>(response.data, z.array(ColorSchema));

    return {
      data: validatedResponseData,
      meta: response.meta,
    };
  },

  findAll: async (): Promise<Color[]> => {
    const response = await ApiService.get<Color[]>({
      endpoint: END_POINTS.findAll,
    });

    const validatedResponseData = validateResponseData<Color[]>(response.data, z.array(ColorSchema));

    return validatedResponseData
  },

  list: async (needle: string): Promise<ListItem[]> => {
    const response = await ApiService.get<ListItem[]>({
      endpoint: END_POINTS.list,
      query: { needle },

    });

    const validatedResponseData = validateResponseData<ListItem[]>(response.data, z.array(ListItemSchema));

    return validatedResponseData;
  },

  findOne: async (id: string): Promise<Color> => {
    const response = await ApiService.get<Color>({
      endpoint: END_POINTS.findOne(id),
    });

    const validatedResponseData = validateResponseData<Color>(response.data, ColorSchema);

    return validatedResponseData;
  },

  update: async (data: ColorForm, id: string): Promise<Color> => {
    const response = await ApiService.put<Color>({
      endpoint: END_POINTS.update(id),
      body: data,
    });

    const validatedResponseData = validateResponseData<Color>(response.data, ColorSchema);

    return validatedResponseData;
  },

  delete: async (id: string) => {
    await ApiService.delete({
      endpoint: END_POINTS.delete(id),
    });
  },


  deleteMany: async (ids: string[]) => {
    await ApiService.delete({
      endpoint: END_POINTS.deleteMany(ids),
      body: { ids },
    });
  },
};

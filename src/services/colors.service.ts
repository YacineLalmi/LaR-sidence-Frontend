import ApiService from "./api.service";
import { QueryParams } from "@/lib/definitions";
import { validateResponseData } from "@/lib/utils";
import { ColorForm } from "@/schemas/colors/color-form.schema";
import { Color, ColorSchema } from "@/schemas/colors/color.schema";
import { ListItem, ListItemSchema } from "@/schemas/global.schema";
import { OfferForm } from "@/schemas/offers/offer-form.schema";
import { Offer, OfferSchema } from "@/schemas/offers/offer.schema";
import z from "zod";

const END_POINTS = {
  create: "/configurations/colors",
  findAll: "/configurations/colors",
  list: "/lists/colors",
  findOne: (id: string) => `/configurations/colors/${id}`,
  update: (id: number) => `/configurations/colors/${id}`,
  delete: (id: number) => `/configurations/colors/${id}`,
};

export const ColorService = {
  create: async (data: ColorForm) => {
    const response = await ApiService.post<Color>({
      endpoint: END_POINTS.create,
      body: data,
    });

    const validatedResponseData = validateResponseData<Offer>(response.data, ColorSchema);

    return validatedResponseData;
  },

  findAll: async (QueryParams: QueryParams) => {
    const response = await ApiService.get<Color[]>({
      endpoint: END_POINTS.findAll,
      query: QueryParams,
    });

    const validatedResponseData = validateResponseData<Color[]>(response.data, z.array(ColorSchema));

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

  findOne: async (id: string) => {
    const response = await ApiService.get<Color>({
      endpoint: END_POINTS.findOne(id),
    });

    const validatedResponseData = validateResponseData<Color>(response.data, ColorSchema);

    return validatedResponseData;
  },

  update: async (data: ColorForm, id: number) => {
    const response = await ApiService.put<Color>({
      endpoint: END_POINTS.update(id),
      body: data,
    });

    const validatedResponseData = validateResponseData<Color>(response.data, ColorSchema);

    return validatedResponseData;
  },

  delete: async (id: number) => {
    await ApiService.delete({
      endpoint: END_POINTS.delete(id),
    });
  },
};

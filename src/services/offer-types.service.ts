import ApiService from "./api.service";
import { QueryParams } from "@/lib/definitions";
import { validateResponseData } from "@/lib/utils";
import { ListItem, ListItemSchema } from "@/schemas/global.schema";
import { OfferTypeForm } from "@/schemas/offer-type/offer-type-form.schema";
import { OfferType, OfferTypeSchema } from "@/schemas/offer-type/offer-type.schema";
import z from "zod";

const END_POINTS = {
  create: "/configurations/offers/types",
  findAll: "/configurations/offers/types",
  list: "/lists/offers/types",
  findOne: (id: string) => `/configurations/offers/types/${id}`,
  update: (id: number) => `/configurations/offers/types/${id}`,
  delete: (id: number) => `/configurations/offers/types/${id}`,
};

export const OfferTypeService = {
  create: async (data: OfferTypeForm) => {
    const response = await ApiService.post<OfferType>({
      endpoint: END_POINTS.create,
      body: data,
    });

    const validatedResponseData = validateResponseData<OfferType>(response.data, OfferTypeSchema);

    return validatedResponseData;
  },

  findAll: async (QueryParams: QueryParams) => {
    const response = await ApiService.get<OfferType[]>({
      endpoint: END_POINTS.findAll,
      query: QueryParams,
    });

    const validatedResponseData = validateResponseData<OfferType[]>(response.data, z.array(OfferTypeSchema));

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
    const response = await ApiService.get<OfferType>({
      endpoint: END_POINTS.findOne(id),
    });

    const validatedResponseData = validateResponseData<OfferType>(response.data, OfferTypeSchema);

    return validatedResponseData;
  },

  update: async (data: OfferTypeForm, id: number) => {
    const response = await ApiService.put<OfferType>({
      endpoint: END_POINTS.update(id),
      body: data,
    });

    const validatedResponseData = validateResponseData<OfferType>(response.data, OfferTypeSchema);

    return validatedResponseData;
  },

  delete: async (id: number) => {
    await ApiService.delete({
      endpoint: END_POINTS.delete(id),
    });
  },
};

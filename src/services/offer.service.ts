import ApiService from "./api.service";
import { PaginatedResponse, QueryParams } from "@/lib/definitions";
import { validateResponseData } from "@/lib/utils";
import { ListItem, ListItemSchema } from "@/schemas/global.schema";
import { OfferForm } from "@/schemas/offers/offer-form.schema";
import { Offer, OfferSchema } from "@/schemas/offers/offer.schema";
import z from "zod";

const END_POINTS = {
  create: "/offers",
  findMany: "/offers",
  list: "/lists/offers",
  typesList: "/lists/offers/types",
  statusList: "/lists/offers/status",
  findOne: (id: string) => `/offers/${id}`,
  update: (id: string) => `/offers/${id}`,
  delete: (id: string) => `/offers/${id}`,
  deleteMany: `/offers/many`,
};

export const OfferService = {
  create: async (data: OfferForm) => {
    const response = await ApiService.post<Offer>({
      endpoint: END_POINTS.create,
      body: data,
    });

    const validatedResponseData = validateResponseData<Offer>(response.data, OfferSchema);

    return validatedResponseData;
  },

  findMany: async (QueryParams: QueryParams): Promise<PaginatedResponse<Offer>> => {
    const response = await ApiService.get<Offer[]>({
      endpoint: END_POINTS.findMany,
      query: QueryParams,
    });

    const validatedResponseData = validateResponseData<Offer[]>(response.data, z.array(OfferSchema));

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

  typesList: async () => {
    const response = await ApiService.get<ListItem[]>({
      endpoint: END_POINTS.typesList,
    });


    const validatedResponseData = validateResponseData<ListItem[]>(response.data, z.array(ListItemSchema));

    return validatedResponseData;
  },

  statusList: async () => {
    const response = await ApiService.get<ListItem[]>({
      endpoint: END_POINTS.statusList,
    });


    const validatedResponseData = validateResponseData<ListItem[]>(response.data, z.array(ListItemSchema));

    return validatedResponseData;
  },

  findOne: async (id: string) => {
    const response = await ApiService.get<Offer>({
      endpoint: END_POINTS.findOne(id),
    });

    const validatedResponseData = validateResponseData<Offer>(response.data, OfferSchema);

    return validatedResponseData;
  },

  update: async (data: OfferForm, id: string) => {
    const response = await ApiService.put<Offer>({
      endpoint: END_POINTS.update(id),
      body: data,
    });

    const validatedResponseData = validateResponseData<Offer>(response.data, OfferSchema);

    return validatedResponseData;
  },

  delete: async (id: string) => {
    await ApiService.delete({
      endpoint: END_POINTS.delete(id),
    });
  },

  deleteMany: async (ids: string[]) => {
    await ApiService.delete({
      endpoint: END_POINTS.deleteMany,
      body: { ids }
    });
  },
};

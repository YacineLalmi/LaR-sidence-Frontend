import ApiService from "./api.service";
import { QueryParams } from "@/lib/definitions";
import { validateResponseData } from "@/lib/utils";
import { ListItem, ListItemSchema } from "@/schemas/Global.schema";
import { OfferForm } from "@/schemas/offers/offer-form.schema";
import { Offer, OfferSchema } from "@/schemas/offers/offer.schema";
import z from "zod";

const END_POINTS = {
  create: "/offers",
  findAll: "/offers",
  list: "/lists/offers",
  typesList: "/lists/offers/types",
  statusList: "/lists/offers/status",
  findOne: (id: string) => `/offers/${id}`,
  update: (id: number) => `/offers/${id}`,
  delete: (id: number) => `/offers/${id}`,
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

  findAll: async (QueryParams: QueryParams) => {
    const response = await ApiService.get<Offer[]>({
      endpoint: END_POINTS.findAll,
      query: QueryParams,
    });

    const validatedResponseData = validateResponseData<Offer[]>(response.data, z.array(OfferSchema));

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

  typesList: async () => {
    const response = await ApiService.get<ListItem[]>({
      endpoint: END_POINTS.typesList,
    });

    console.log("response", response);
    const validatedResponseData = validateResponseData<ListItem[]>(response.data, z.array(ListItemSchema));

    return validatedResponseData;
  },

  statusList: async () => {
    const response = await ApiService.get<ListItem[]>({
      endpoint: END_POINTS.statusList,
    });

    console.log("response", response);
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

  update: async (data: OfferForm, id: number) => {
    const response = await ApiService.put<Offer>({
      endpoint: END_POINTS.update(id),
      body: data,
    });

    const validatedResponseData = validateResponseData<Offer>(response.data, OfferSchema);

    return validatedResponseData;
  },

  delete: async (id: number) => {
    await ApiService.delete({
      endpoint: END_POINTS.delete(id),
    });
  },
};

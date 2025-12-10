import ApiService from "./api.service";
import { QueryParams } from "@/lib/definitions";
import { validateResponseData } from "@/lib/utils";
import { ClientStatusForm } from "@/schemas/client-status/client-status-form.schema";
import { ClientStatus, ClientStatusSchema } from "@/schemas/client-status/client-status.schema";
import { ListItem, ListItemSchema } from "@/schemas/Global.schema";
import { OfferStatusForm } from "@/schemas/offer-status/offer-status-form.schema";
import { OfferStatus, OfferStatusSchema } from "@/schemas/offer-status/offer-status.schema";
import z from "zod";

const END_POINTS = {
  create: "/configurations/offers/status",
  findAll: "/configurations/offers/status",
  list: "/lists/offers/status",
  findOne: (id: string) => `/configurations/offers/status/${id}`,
  update: (id: number) => `/configurations/offers/status/${id}`,
  delete: (id: string) => `/configurations/offers/status/${id}`,
};

export const OfferStatusService = {
  create: async (data: OfferStatusForm) => {
    const response = await ApiService.post<OfferStatus>({
      endpoint: END_POINTS.create,
      body: data,
    });

    const validatedResponseData = validateResponseData<OfferStatus>(response.data, OfferStatusSchema);

    return validatedResponseData;
  },

  findAll: async (QueryParams: QueryParams) => {
    const response = await ApiService.get<OfferStatus[]>({
      endpoint: END_POINTS.findAll,
      query: QueryParams,
    });

    const validatedResponseData = validateResponseData<OfferStatus[]>(response.data, z.array(OfferStatusSchema));

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
    const response = await ApiService.get<OfferStatus>({
      endpoint: END_POINTS.findOne(id),
    });

    const validatedResponseData = validateResponseData<OfferStatus>(response.data, OfferStatusSchema);

    return validatedResponseData;
  },

  update: async (data: OfferStatusForm, id: number) => {
    const response = await ApiService.put<OfferStatus>({
      endpoint: END_POINTS.update(id),
      body: data,
    });

    const validatedResponseData = validateResponseData<OfferStatus>(response.data, OfferStatusSchema);

    return validatedResponseData;
  },

  delete: async (id: string) => {
    await ApiService.delete({
      endpoint: END_POINTS.delete(id),
    });
  },
};

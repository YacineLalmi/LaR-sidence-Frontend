import ApiService from "./api.service";
import { QueryParams } from "@/lib/definitions";
import { validateResponseData } from "@/lib/utils";
import { BienTransaction, BienTransactionForm, BienTransactionSchema } from "@/schemas/BienTransaction.schema";
import { ListItem, ListItemSchema } from "@/schemas/Global.schema";
import z from "zod";

const END_POINTS = {
  create: "/configurations/biens/transactions",
  findAll: "/configurations/biens/transactions",
  list: "/lists/transactions/types",
  findOne: (id: number) => `/configurations/biens/transactions/${id}`,
  update: (id: number) => `/configurations/biens/transactions/${id}`,
  delete: (id: number) => `/configurations/biens/transactions/${id}`,
};

export const BienTransactionService = {
  create: async (data: BienTransactionForm) => {
    const response = await ApiService.post<BienTransaction>({
      endpoint: END_POINTS.create,
      body: data,
    });

    const validatedResponseData = validateResponseData<BienTransaction>(response.data, BienTransactionSchema);

    return validatedResponseData;
  },

  findAll: async (queryParams: QueryParams) => {
    const response = await ApiService.get<BienTransaction[]>({
      endpoint: END_POINTS.findAll,
      query: queryParams,
    });

    const validatedResponseData = validateResponseData<BienTransaction[]>(
      response.data,
      z.array(BienTransactionSchema)
    );

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
    const response = await ApiService.get<BienTransaction>({
      endpoint: END_POINTS.findOne(id),
    });

    const validatedResponseData = validateResponseData<BienTransaction>(response.data, BienTransactionSchema);

    return validatedResponseData;
  },

  update: async (data: BienTransaction, id: number) => {
    const response = await ApiService.put<BienTransaction>({
      endpoint: END_POINTS.update(id),
      body: data,
    });

    const validatedResponseData = validateResponseData<BienTransaction>(response.data, BienTransactionSchema);

    return validatedResponseData;
  },

  delete: async (id: number) => {
    await ApiService.delete({
      endpoint: END_POINTS.delete(id),
    });
  },
};

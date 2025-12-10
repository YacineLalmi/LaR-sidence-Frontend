import ApiService from "./api.service";
import { QueryParams } from "@/lib/definitions";
import { validateResponseData } from "@/lib/utils";
import { ListItem, ListItemSchema } from "@/schemas/Global.schema";
import { TransactionTypeForm } from "@/schemas/transaction-type/transaction-type-form.schema";
import { TransactionType, TransactionTypeSchema } from "@/schemas/transaction-type/transaction-type.schema";
import z from "zod";

const END_POINTS = {
  create: "/configurations/biens/transactions",
  findAll: "/configurations/biens/transactions",
  list: "/lists/transactions/types",
  findOne: (id: number) => `/configurations/biens/transactions/${id}`,
  update: (id: number) => `/configurations/biens/transactions/${id}`,
  delete: (id: number) => `/configurations/biens/transactions/${id}`,
};

export const TransactionTypeService = {
  create: async (data: TransactionTypeForm) => {
    const response = await ApiService.post<TransactionType>({
      endpoint: END_POINTS.create,
      body: data,
    });

    const validatedResponseData = validateResponseData<TransactionType>(response.data, TransactionTypeSchema);

    return validatedResponseData;
  },

  findAll: async (queryParams: QueryParams) => {
    const response = await ApiService.get<TransactionType[]>({
      endpoint: END_POINTS.findAll,
      query: queryParams,
    });

    const validatedResponseData = validateResponseData<TransactionType[]>(
      response.data,
      z.array(TransactionTypeSchema)
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
    const response = await ApiService.get<TransactionType>({
      endpoint: END_POINTS.findOne(id),
    });

    const validatedResponseData = validateResponseData<TransactionType>(response.data, TransactionTypeSchema);

    return validatedResponseData;
  },

  update: async (data: TransactionTypeForm, id: number) => {
    const response = await ApiService.put<TransactionType>({
      endpoint: END_POINTS.update(id),
      body: data,
    });

    const validatedResponseData = validateResponseData<TransactionType>(response.data, TransactionTypeSchema);

    return validatedResponseData;
  },

  delete: async (id: number) => {
    await ApiService.delete({
      endpoint: END_POINTS.delete(id),
    });
  },
};

import ApiService from "./api.service";
import { PaginatedResponse, QueryParams } from "@/lib/definitions";
import { validateResponseData } from "@/lib/utils";
import { BillForm } from "@/schemas/bills/bill-form.schema";
import { Bill, BillSchema } from "@/schemas/bills/bill.schema";
import z from "zod";

const END_POINTS = {
  create: "/bills",
  findMany: "/bills",
  findOne: (id: string) => `/bills/${id}`,
  update: (id: string) => `/bills/${id}`,
  delete: (id: string) => `/bills/${id}`,
  deleteMany: "/bills/many",
};

export const BillService = {
  create: async (data: FormData) => {
    const response = await ApiService.post<Bill>({
      endpoint: END_POINTS.create,
      body: data,
    });

    const validatedResponseData = validateResponseData<Bill>(response.data, BillSchema);

    return validatedResponseData;
  },

  findMany: async (QueryParams: QueryParams): Promise<PaginatedResponse<Bill>> => {
    const response = await ApiService.get<Bill[]>({
      endpoint: END_POINTS.findMany,
      query: QueryParams,
    });

    const validatedResponseData = validateResponseData<Bill[]>(response.data, z.array(BillSchema));

    return {
      data: validatedResponseData,
      meta: response.meta,
    };
  },

  findOne: async (id: string, queryParam?: QueryParams) => {
    const response = await ApiService.get<Bill>({
      endpoint: END_POINTS.findOne(id),
      query: queryParam
    });

    const validatedResponseData = validateResponseData<Bill>(response.data, BillSchema);

    return validatedResponseData;
  },

  update: async (data: FormData, id: string) => {
    const response = await ApiService.post<Bill>({
      endpoint: END_POINTS.update(id),
      body: data,
    });

    const validatedResponseData = validateResponseData<Bill>(response.data, BillSchema);

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
      body: { ids },
    });
  },
};

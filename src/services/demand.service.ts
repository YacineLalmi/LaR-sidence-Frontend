import ApiService from "./api.service";
import { PaginatedResponse, QueryParams } from "@/lib/definitions";
import { validateResponseData } from "@/lib/utils";
import { DemandForm } from "@/schemas/demands/demand-form.schema";
import { Demand, DemandSchema } from "@/schemas/demands/demand.schema";
import z from "zod";

const END_POINTS = {
  create: "/demands",
  findMany: "/demands",
  findOne: (id: string) => `/demands/${id}`,
  update: (id: string) => `/demands/${id}`,
  delete: (id: string) => `/demands/${id}`,
  deleteMany: "/demands/many",
};

export const DemandService = {
  create: async (data: DemandForm) => {
    const response = await ApiService.post<Demand>({
      endpoint: END_POINTS.create,
      body: data,
    });

    const validatedResponseData = validateResponseData<Demand>(response.data, DemandSchema);

    return validatedResponseData;
  },

  findMany: async (QueryParams: QueryParams): Promise<PaginatedResponse<Demand>> => {
    const response = await ApiService.get<Demand[]>({
      endpoint: END_POINTS.findMany,
      query: QueryParams,
    });

    const validatedResponseData = validateResponseData<Demand[]>(response.data, z.array(DemandSchema));

    return {
      data: validatedResponseData,
      meta: response.meta,
    };
  },

  findOne: async (id: string) => {
    const response = await ApiService.get<Demand>({
      endpoint: END_POINTS.findOne(id),
    });

    const validatedResponseData = validateResponseData<Demand>(response.data, DemandSchema);

    return validatedResponseData;
  },

  update: async (data: DemandForm, id: string) => {
    const response = await ApiService.put<Demand>({
      endpoint: END_POINTS.update(id),
      body: data,
    });

    const validatedResponseData = validateResponseData<Demand>(response.data, DemandSchema);

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

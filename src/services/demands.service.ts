import ApiService from "./api.service";
import { QueryParams } from "@/lib/definitions";
import { validateResponseData } from "@/lib/utils";
import { DemandForm } from "@/schemas/demands/demand-form.schema";
import { Demand, DemandSchema } from "@/schemas/demands/demand.schema";
import z from "zod";

const END_POINTS = {
  create: "/demands",
  findAll: "/demands",
  findOne: (id: string) => `/demands/${id}`,
  update: (id: number) => `/demands/${id}`,
  delete: (id: number) => `/demands/${id}`,
};

export const DemandsService = {
  create: async (data: DemandForm) => {
    const response = await ApiService.post<Demand>({
      endpoint: END_POINTS.create,
      body: data,
    });

    const validatedResponseData = validateResponseData<Demand>(response.data, DemandSchema);

    return validatedResponseData;
  },

  findAll: async (QueryParams: QueryParams) => {
    const response = await ApiService.get<Demand[]>({
      endpoint: END_POINTS.findAll,
      query: QueryParams,
    });

    const validatedResponseData = validateResponseData<Demand[]>(response.data, z.array(DemandSchema));

    return {
      items: validatedResponseData,
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

  update: async (data: DemandForm, id: number) => {
    const response = await ApiService.put<Demand>({
      endpoint: END_POINTS.update(id),
      body: data,
    });

    const validatedResponseData = validateResponseData<Demand>(response.data, DemandSchema);

    return validatedResponseData;
  },

  delete: async (id: number) => {
    await ApiService.delete({
      endpoint: END_POINTS.delete(id),
    });
  },
};

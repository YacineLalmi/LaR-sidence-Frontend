import ApiService from "./api.service";
import { QueryParams } from "@/lib/definitions";
import { validateResponseData } from "@/lib/utils";
import { Bien, BienSchema, CreateBien } from "@/schemas/Bien.schema";
import z from "zod";

const END_POINTS = {
  create: "/biens",
  findAll: "/biens",
  findOne: (id: string) => `/biens/${id}`,
  update: (id: string) => `/biens/${id}`,
  delete: (id: string) => `/biens/${id}`,
};

export const BienService = {
  create: async (data: CreateBien) => {
    const response = await ApiService.post<Bien>({
      endpoint: END_POINTS.create,
      body: data,
    });

    const validatedResponseData = validateResponseData<Bien>(response.data, BienSchema);

    return validatedResponseData;
  },

  findAll: async (queryParams: QueryParams) => {
    const response = await ApiService.get<Bien[]>({
      endpoint: END_POINTS.findAll,
      query: queryParams,
    });

    const validatedResponseData = validateResponseData<Bien[]>(response.data, z.array(BienSchema));

    return {
      items: validatedResponseData,
      meta: response.meta,
    };
  },

  findOne: async (id: string) => {
    const response = await ApiService.get<Bien>({
      endpoint: END_POINTS.findOne(id),
    });

    const validatedResponseData = validateResponseData<Bien>(response.data, BienSchema);

    return validatedResponseData;
  },

  update: async (data: Bien, id: string) => {
    const response = await ApiService.put<Bien>({
      endpoint: END_POINTS.update(id),
      body: data,
    });

    const validatedResponseData = validateResponseData<Bien>(response.data, BienSchema);

    return validatedResponseData;
  },

  delete: async (id: string) => {
    await ApiService.delete({
      endpoint: END_POINTS.delete(id),
    });
  },
};

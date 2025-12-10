import ApiService from "./api.service";
import { QueryParams } from "@/lib/definitions";
import { validateResponseData } from "@/lib/utils";

import { BienForm } from "@/schemas/biens/bien-form.schema";
import { Bien, BienSchema } from "@/schemas/biens/bien.schema";
import { ListItem, ListItemSchema } from "@/schemas/Global.schema";
import z from "zod";

const END_POINTS = {
  create: "/biens",
  findAll: "/biens",
  list: "/lists/biens",
  findOne: (id: string) => `/biens/${id}`,
  update: (id: string) => `/biens/${id}`,
  delete: (id: string) => `/biens/${id}`,
};

export const BienService = {
  create: async (data: BienForm) => {
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
    console.log("response", response);
    const validatedResponseData = validateResponseData<Bien[]>(response.data, z.array(BienSchema));
    console.log("validated data", validateResponseData);
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

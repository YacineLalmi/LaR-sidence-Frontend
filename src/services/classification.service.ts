import ApiService from "./api.service";
import { PaginatedResponse, QueryParams } from "@/lib/definitions";
import { validateResponseData } from "@/lib/utils";
import { ClassificationForm } from "@/schemas/classification/classification-form.schema";
import { Classification, ClassificationSchema } from "@/schemas/classification/classification.schema";
import { ListItem, ListItemSchema } from "@/schemas/global.schema";
import z from "zod";

export const CATEGORIES = {
  TYPE: "type",
  STATUS: "status",
  SOURCE: "source",
  PRIORITY: "priority",
  CHARACTERISTIC: "characteristic",
  METHOD: "method",
}

export const SCOPES = {
  BIEN: "bien",
  BILL: "bill",
  CLEINT: "client",
  OFFER: "offer",
  DEMAND: "demand",
  EVENT: "event",
  TRANSACTION: "transaction",
  PAYMENT: "payment",
}

const END_POINTS = {
  create: (category: string, scope: string) => `/configurations/classifications/${category}/${scope}`,
  findAll: (category: string, scope: string) => `/configurations/classifications/${category}/${scope}/all`,
  findMany: (category: string, scope: string) => `/configurations/classifications/${category}/${scope}`,
  listAll: (category: string, scope: string) => `/lists/classifications/${category}/${scope}`,
  list: (category: string, scope: string) => `/lists/classifications/${category}/${scope}`,
  findOne: (category: string, scope: string, id: string) => `/configurations/classifications/${category}/${scope}/${id}`,
  update: (category: string, scope: string, id: string) => `/configurations/classifications/${category}/${scope}/${id}`,
  delete: (category: string, scope: string, id: string) => `/configurations/classifications/${category}/${scope}/${id}`,
  deleteMany: (category: string, scope: string) => `/configurations/classifications/${category}/${scope}/many`,
};

export const ClassificationService = (category: string, scope: string) => ({
  create: async (data: ClassificationForm) => {
    const response = await ApiService.post<Classification>({
      endpoint: END_POINTS.create(category, scope),
      body: data,
    });

    return validateResponseData<Classification>(response.data, ClassificationSchema);
  },

  findAll: async (): Promise<PaginatedResponse<Classification>> => {
    const response = await ApiService.get<Classification[]>({
      endpoint: END_POINTS.findAll(category, scope),
    });

    const validatedResponseData = validateResponseData<Classification[]>(response.data, z.array(ClassificationSchema));

    return {
      data: validatedResponseData,
      meta: response.meta,
    };
  },

  findMany: async (queryParams: QueryParams): Promise<PaginatedResponse<Classification>> => {
    const response = await ApiService.get<Classification[]>({
      endpoint: END_POINTS.findMany(category, scope),
      query: queryParams,
    });

    const validatedResponseData = validateResponseData<Classification[]>(response.data, z.array(ClassificationSchema));

    return {
      data: validatedResponseData,
      meta: response.meta,
    };
  },

  listAll: async (): Promise<ListItem[]> => {
    const response = await ApiService.get<ListItem[]>({
      endpoint: END_POINTS.listAll(category, scope),
    });

    return validateResponseData<ListItem[]>(response.data, z.array(ListItemSchema));
  },

  list: async (needle: string): Promise<ListItem[]> => {
    const response = await ApiService.get<ListItem[]>({
      endpoint: END_POINTS.list(category, scope),
      query: { needle }
    });

    return validateResponseData<ListItem[]>(response.data, z.array(ListItemSchema));
  },

  findOne: async (id: string) => {
    const response = await ApiService.get<Classification>({
      endpoint: END_POINTS.findOne(category, scope, id),
    });

    return validateResponseData<Classification>(response.data, ClassificationSchema);
  },

  update: async (data: ClassificationForm, id: string) => {
    const response = await ApiService.put<Classification>({
      endpoint: END_POINTS.update(category, scope, id),
      body: data,
    });

    return validateResponseData<Classification>(response.data, ClassificationSchema);
  },

  delete: async (id: string) => {
    await ApiService.delete({
      endpoint: END_POINTS.delete(category, scope, id),
    });
  },

  // Ajout de la méthode pour la suppression groupée
  deleteMany: async (ids: string[]) => {
    await ApiService.delete({
      endpoint: END_POINTS.deleteMany(category, scope),
      body: { ids },
    });
  },
})
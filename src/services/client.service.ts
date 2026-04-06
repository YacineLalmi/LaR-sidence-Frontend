import ApiService from "./api.service";
import { PaginatedResponse, QueryParams } from "@/lib/definitions";
import { validateResponseData } from "@/lib/utils";
import { ClientForm } from "@/schemas/clients/client-form.schema";
import { Client, ClientSchema } from "@/schemas/clients/client.schema";
import { ListItem, ListItemSchema } from "@/schemas/global.schema";
import { da } from "date-fns/locale";
import z from "zod";

const END_POINTS = {
  create: "/clients",
  findMany: "/clients",
  list: "/lists/clients",
  statusList: "/lists/clients/status",
  typesList: "/lists/clients/types",
  sourcesList: "/lists/clients/sources",
  findOne: (id: string) => `/clients/${id}`,
  update: (id: string) => `/clients/${id}`,
  delete: (id: string) => `/clients/${id}`,
  deleteMany: `/clients/many`,
};

export const ClientService = {
  create: async (data: ClientForm): Promise<Client> => {
    const formData = new FormData();
    for (const key in data) {
      if (key === "documents") {
        const files = (data as any)[key] as File[];
        files.forEach((file: File, index: number) => {
          formData.append(`${key}[${index}]`, file);
        });
        continue;
      }
      if (key === "phone_numbers") {
        const phoneNumbers = (data as any)[key];
        phoneNumbers.forEach((phoneNumber: string, index: number) => {
          formData.append(`${key}[${index}]`, phoneNumber);
        });
        continue;
      }
      if ((data as any)[key] instanceof Date) {
        formData.append(key, (data as any)[key].toISOString());
        continue;
      }

      if (typeof (data as any)[key] === "boolean") {
        formData.append(key, (data as any)[key] ? "1" : "0");
        continue;
      }
      const value = (data as any)[key];
      formData.append(key, value);
    }
    const response = await ApiService.post<Client>({
      endpoint: END_POINTS.create,
      body: formData,
    });

    const validatedResponseData = validateResponseData<Client>(response.data, ClientSchema);

    return validatedResponseData;
  },

  findMany: async (QueryParams: QueryParams): Promise<PaginatedResponse<Client>> => {
    const response = await ApiService.get<Client[]>({
      endpoint: END_POINTS.findMany,
      query: QueryParams,
    });

    const validatedResponseData = validateResponseData<Client[]>(response.data, z.array(ClientSchema));

    return {
      data: validatedResponseData,
      meta: response.meta,
    };
  },

  list: async (needle?: string) => {
    const response = await ApiService.get<ListItem[]>({
      endpoint: END_POINTS.list,
      query: {
        needle: needle || "",
      },
    });

    const validatedResponseData = validateResponseData<ListItem[]>(response.data, z.array(ListItemSchema));

    return validatedResponseData;
  },

  statusList: async () => {
    const response = await ApiService.get<ListItem[]>({
      endpoint: END_POINTS.statusList,
    });

    const validatedResponseData = validateResponseData<ListItem[]>(response.data, z.array(ListItemSchema));

    return validatedResponseData;
  },

  typesList: async () => {
    const response = await ApiService.get<ListItem[]>({
      endpoint: END_POINTS.typesList,
    });

    const validatedResponseData = validateResponseData<ListItem[]>(response.data, z.array(ListItemSchema));

    return validatedResponseData;
  },

  sourcesList: async () => {
    const response = await ApiService.get<ListItem[]>({
      endpoint: END_POINTS.sourcesList,
    });

    const validatedResponseData = validateResponseData<ListItem[]>(response.data, z.array(ListItemSchema));

    return validatedResponseData;
  },

  findOne: async (id: string) => {
    const response = await ApiService.get<Client>({
      endpoint: END_POINTS.findOne(id),
    });

    const validatedResponseData = validateResponseData<Client>(response.data, ClientSchema);

    return validatedResponseData;
  },

  update: async (data: ClientForm, id: string) => {
    const formData = new FormData();
    for (const key in data) {
      if (key === "documents") {
        const files = (data as any)[key] as File[];
        files.forEach((file: File, index: number) => {
          formData.append(`${key}[${index}]`, file);
        });
        continue;
      }
      if (key === "phone_numbers") {
        const phoneNumbers = (data as any)[key];
        phoneNumbers.forEach((phoneNumber: string, index: number) => {
          formData.append(`${key}[${index}]`, phoneNumber);
        });
        continue;
      }
      if ((data as any)[key] instanceof Date) {
        formData.append(key, (data as any)[key].toISOString());
        continue;
      }

      if (typeof (data as any)[key] === "boolean") {
        formData.append(key, (data as any)[key] ? "1" : "0");
        continue;
      }
      const value = (data as any)[key];
      formData.append(key, value);
    }
    const response = await ApiService.post<Client>({
      endpoint: END_POINTS.update(id.toString()),
      body: formData,
    });

    const validatedResponseData = validateResponseData<Client>(response.data, ClientSchema);

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
      body: { ids }
    });
  },
};

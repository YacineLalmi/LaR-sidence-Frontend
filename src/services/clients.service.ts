import ApiService from "./api.service";
import { QueryParams } from "@/lib/definitions";
import { validateResponseData } from "@/lib/utils";
import { ClientForm } from "@/schemas/clients/client-form.schema";
import { Client, ClientSchema } from "@/schemas/clients/client.schema";
import { ListItem, ListItemSchema } from "@/schemas/Global.schema";
import z from "zod";

const END_POINTS = {
  create: "/clients",
  findAll: "/clients",
  list: "/lists/clients",
  statusList: "/lists/clients/status",
  typesList: "/lists/clients/types",
  sourcesList: "/lists/clients/sources",
  findOne: (id: string) => `/clients/${id}`,
  update: (id: string) => `/clients/${id}`,
  delete: (id: string) => `/clients/${id}`,
};

export const ClientsService = {
  create: async (data: ClientForm) => {
    const adjustedData = {
      ...data,
      phone_numbers: data.phone_numbers.map((item) => item.phoneNumber),
    };
    console.log("first", adjustedData);
    const response = await ApiService.post<Client>({
      endpoint: END_POINTS.create,
      body: adjustedData,
    });

    console.log(response.data?.phone_numbers);
    const validatedResponseData = validateResponseData<Client>(response.data, ClientSchema);

    return validatedResponseData;
  },

  findAll: async (QueryParams: QueryParams) => {
    const response = await ApiService.get<Client[]>({
      endpoint: END_POINTS.findAll,
      query: QueryParams,
    });

    const validatedResponseData = validateResponseData<Client[]>(response.data, z.array(ClientSchema));

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

  update: async (data: ClientForm, id: number) => {
    const response = await ApiService.post<Client>({
      endpoint: END_POINTS.update(id.toString()),
      body: data,
    });

    const validatedResponseData = validateResponseData<Client>(response.data, ClientSchema);

    return validatedResponseData;
  },

  delete: async (id: string) => {
    await ApiService.delete({
      endpoint: END_POINTS.delete(id),
    });
  },
};

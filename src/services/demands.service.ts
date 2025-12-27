import ApiService from "./api.service";
import { QueryParams } from "@/lib/definitions";
import { validateResponseData } from "@/lib/utils";
import { ListItem, ListItemSchema } from "@/schemas/Global.schema";
import { DemandForm } from "@/schemas/demands/demand-form.schema";
import { Demand, DemandSchema } from "@/schemas/demands/demand.schema";
import z from "zod";

const END_POINTS = {
  create: "/demands",
  findAll: "/demands",
  typesList: "/lists/demands/types",
  statusList: "/lists/demands/status",
  prioritiesList: "/lists/demands/priorities",
  sourcesList: "/lists/demands/sources",
  findOne: (id: string) => `/demands/${id}`,
  update: (id: string) => `/demands/${id}`,
  delete: (id: string) => `/demands/${id}`,
  // Fallback to configuration endpoints if list endpoints don't exist
  typesListConfig: "/configurations/demands/types",
  statusListConfig: "/configurations/demands/status",
  prioritiesListConfig: "/configurations/demands/priorities",
  sourcesListConfig: "/configurations/demands/sources",
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

  typesList: async () => {
    try {
      const response = await ApiService.get<ListItem[]>({
        endpoint: END_POINTS.typesList,
      });
      const validatedResponseData = validateResponseData<ListItem[]>(response.data, z.array(ListItemSchema));
      return validatedResponseData;
    } catch {
      // Fallback to configuration endpoint
      const response = await ApiService.get<any>({
        endpoint: END_POINTS.typesListConfig,
        query: { per_page: "100" },
      });
      // Transform the response to ListItem format
      if (response.data?.data) {
        return response.data.data.map((item: any) => ({
          id: String(item.id),
          name: item.name,
        }));
      }
      return [];
    }
  },

  statusList: async () => {
    try {
      const response = await ApiService.get<ListItem[]>({
        endpoint: END_POINTS.statusList,
      });
      const validatedResponseData = validateResponseData<ListItem[]>(response.data, z.array(ListItemSchema));
      return validatedResponseData;
    } catch {
      // Fallback to configuration endpoint
      const response = await ApiService.get<any>({
        endpoint: END_POINTS.statusListConfig,
        query: { per_page: "100" },
      });
      if (response.data?.data) {
        return response.data.data.map((item: any) => ({
          id: item.id.toString(),
          name: item.name,
        }));
      }
      return [];
    }
  },

  prioritiesList: async () => {
    try {
      const response = await ApiService.get<ListItem[]>({
        endpoint: END_POINTS.prioritiesList,
      });
      const validatedResponseData = validateResponseData<ListItem[]>(response.data, z.array(ListItemSchema));
      return validatedResponseData;
    } catch {
      // Fallback to configuration endpoint
      const response = await ApiService.get<any>({
        endpoint: END_POINTS.prioritiesListConfig,
        query: { per_page: "100" },
      });
      if (response.data?.data) {
        return response.data.data.map((item: any) => ({
          id: item.id.toString(),
          name: item.name,
        }));
      }
      return [];
    }
  },

  sourcesList: async () => {
    try {
      const response = await ApiService.get<ListItem[]>({
        endpoint: END_POINTS.sourcesList,
      });
      const validatedResponseData = validateResponseData<ListItem[]>(response.data, z.array(ListItemSchema));
      return validatedResponseData;
    } catch {
      // Fallback to configuration endpoint
      const response = await ApiService.get<any>({
        endpoint: END_POINTS.sourcesListConfig,
        query: { per_page: "100" },
      });
      if (response.data?.data) {
        return response.data.data.map((item: any) => ({
          id: item.id.toString(),
          name: item.name,
        }));
      }
      return [];
    }
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
};


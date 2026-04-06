import ApiService from "./api.service";
import { PaginatedResponse, QueryParams } from "@/lib/definitions";
import { validateResponseData } from "@/lib/utils";
import { ListItem, ListItemSchema } from "@/schemas/global.schema";
import { RoleForm } from "@/schemas/roles/role-form.schema";
import { Role, RoleSchema } from "@/schemas/roles/role.schema";
import z from "zod";

const END_POINTS = {
  create: "/configurations/roles",
  findMany: "/configurations/roles",
  list: "/lists/roles",
  findOne: (id: string) => `/configurations/roles/${id}`,
  update: (id: string) => `/configurations/roles/${id}`,
  delete: (id: string) => `/configurations/roles/${id}`,
  deleteMany: `/configurations/roles/many`,
};

export const RoleService = {
  create: async (data: RoleForm): Promise<Role> => {
    const response = await ApiService.post<Role>({
      endpoint: END_POINTS.create,
      body: data,
    });

    const validatedResponseData = validateResponseData<Role>(response.data, RoleSchema);

    return validatedResponseData;
  },

  findMany: async (QueryParams: QueryParams): Promise<PaginatedResponse<Role>> => {
    const response = await ApiService.get<Role[]>({
      endpoint: END_POINTS.findMany,
      query: QueryParams,
    });

    const validatedResponseData = validateResponseData<Role[]>(response.data, z.array(RoleSchema));

    return {
      data: validatedResponseData,
      meta: response.meta,
    };
  },

  list: async (): Promise<ListItem[]> => {
    const response = await ApiService.get<ListItem[]>({
      endpoint: END_POINTS.list,
    });

    const validatedResponseData = validateResponseData<ListItem[]>(response.data, z.array(ListItemSchema));

    return validatedResponseData;
  },

  findOne: async (id: string): Promise<Role> => {
    const response = await ApiService.get<Role>({
      endpoint: END_POINTS.findOne(id),
    });

    const validatedResponseData = validateResponseData<Role>(response.data, RoleSchema);

    return validatedResponseData;
  },

  update: async (data: RoleForm, id: string): Promise<Role> => {
    const response = await ApiService.put<Role>({
      endpoint: END_POINTS.update(id),
      body: data,
    });

    const validatedResponseData = validateResponseData<Role>(response.data, RoleSchema);

    return validatedResponseData;
  },

  delete: async (id: string): Promise<void> => {
    await ApiService.delete({
      endpoint: END_POINTS.delete(id),
    });
  },

  deleteMany: async (ids: string[]): Promise<void> => {
    await ApiService.delete({
      endpoint: END_POINTS.deleteMany,
      body: { ids }
    });
  },
};

import ApiService from "./api.service";
import { QueryParams } from "@/lib/definitions";
import { validateResponseData } from "@/lib/utils";
import { ListItem, ListItemSchema } from "@/schemas/global.schema";
import { RoleForm } from "@/schemas/roles/role-form.schema";
import { Role, RoleSchema } from "@/schemas/roles/role.schema";
import z from "zod";

const END_POINTS = {
  create: "/configurations/roles",
  findAll: "/configurations/roles",
  list: "/lists/roles",
  findOne: (id: string) => `/configurations/roles/${id}`,
  update: (id: number) => `/configurations/roles/${id}`,
  delete: (id: number) => `/configurations/roles/${id}`,
};

export const RoleService = {
  create: async (data: RoleForm) => {
    const response = await ApiService.post<Role>({
      endpoint: END_POINTS.create,
      body: data,
    });

    const validatedResponseData = validateResponseData<Role>(response.data, RoleSchema);

    return validatedResponseData;
  },

  findAll: async (QueryParams: QueryParams) => {
    const response = await ApiService.get<Role[]>({
      endpoint: END_POINTS.findAll,
      query: QueryParams,
    });

    const validatedResponseData = validateResponseData<Role[]>(response.data, z.array(RoleSchema));

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
    const response = await ApiService.get<Role>({
      endpoint: END_POINTS.findOne(id),
    });

    const validatedResponseData = validateResponseData<Role>(response.data, RoleSchema);

    return validatedResponseData;
  },

  update: async (data: RoleForm, id: number) => {
    const response = await ApiService.put<Role>({
      endpoint: END_POINTS.update(id),
      body: data,
    });

    const validatedResponseData = validateResponseData<Role>(response.data, RoleSchema);

    return validatedResponseData;
  },

  delete: async (id: number) => {
    await ApiService.delete({
      endpoint: END_POINTS.delete(id),
    });
  },
};

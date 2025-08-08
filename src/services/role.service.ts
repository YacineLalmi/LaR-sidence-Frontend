import ApiService from "./api.service";
import { QueryParams } from "@/lib/definitions";
import { validateResponseData } from "@/lib/utils";
import { Role, RoleForm, RoleSchema } from "@/schemas/role.schema";
import z from "zod";

const END_POINTS = {
  create: "/configurations/users/roles",
  findAll: "/configurations/users/roles",
  findOne: (id: number) => `/configurations/users/roles/${id}`,
  update: (id: number) => `/configurations/users/roles/${id}`,
  delete: (id: number) => `/configurations/users/roles/${id}`,
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

    console.log(response);
    const validatedResponseData = validateResponseData<Role[]>(response.data, z.array(RoleSchema));

    return {
      items: validatedResponseData,
      meta: response.meta,
    };
  },

  findOne: async (id: number) => {
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

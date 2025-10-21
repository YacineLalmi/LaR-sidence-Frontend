import ApiService from "./api.service";
import { QueryParams } from "@/lib/definitions";
import { validateResponseData } from "@/lib/utils";
import { ListItem, ListItemSchema } from "@/schemas/Global.schema";
import { RoleForm } from "@/schemas/role.schema";
import { RoleDetails, RoleDetailsSchema } from "@/schemas/roles/role.schema";
import { Role, RoleSchema } from "@/schemas/roles/roles.schema";
import z from "zod";

const END_POINTS = {
  create: "/configurations/roles",
  findAll: "/configurations/roles",
  list: "/lists/roles",
  findOne: (id: string) => `/configurations/roles/${id}`,
  update: (id: string) => `/configurations/roles/${id}`,
  delete: (id: string) => `/configurations/roles/${id}`,
};

export const RoleService = {
  create: async (data: RoleForm) => {
    const response = await ApiService.post<RoleDetails>({
      endpoint: END_POINTS.create,
      body: data,
    });

    const validatedResponseData = validateResponseData<RoleDetails>(response.data, RoleDetailsSchema);

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

  list: async () => {
    const response = await ApiService.get<ListItem[]>({
      endpoint: END_POINTS.list,
    });

    console.log("response", response);
    const validatedResponseData = validateResponseData<ListItem[]>(response.data, z.array(ListItemSchema));

    return validatedResponseData;
  },

  findOne: async (id: string) => {
    const response = await ApiService.get<RoleDetails>({
      endpoint: END_POINTS.findOne(id),
    });

    const validatedResponseData = validateResponseData<RoleDetails>(response.data, RoleDetailsSchema);

    return validatedResponseData;
  },

  update: async (id: string, data: RoleForm) => {
    const response = await ApiService.put<RoleDetails>({
      endpoint: END_POINTS.update(id),
      body: data,
    });

    const validatedResponseData = validateResponseData<RoleDetails>(response.data, RoleDetailsSchema);

    return validatedResponseData;
  },

  delete: async (id: string) => {
    await ApiService.delete({
      endpoint: END_POINTS.delete(id),
    });
  },
};

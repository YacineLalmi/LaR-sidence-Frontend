import ApiService from "./api.service";
import { QueryParams } from "@/lib/definitions";
import { validateResponseData } from "@/lib/utils";
import { ListItem, ListItemSchema } from "@/schemas/global.schema";
import { UserForm } from "@/schemas/users/user-form.schema";
import { User, UserSchema } from "@/schemas/users/user.schema";
import z from "zod";

const END_POINTS = {
  create: "/configurations/users",
  findAll: "/configurations/users",
  agentsList: "/lists/agents",
  profile: "/profile",
  findOne: (id: string) => `/configurations/users/${id}`,
  update: (id: number) => `/configurations/users/${id}`,
  delete: (id: number) => `/configurations/users/${id}`,
};

export const UserService = {
  create: async (data: UserForm) => {
    console.log("before formed", data);
    const formedData = {
      ...data,
      is_active: data.is_active === "0" ? false : true,
    };
    console.log("Create User Data", formedData);
    const response = await ApiService.post<User>({
      endpoint: END_POINTS.create,
      body: formedData,
    });

    const validatedResponseData = validateResponseData<User>(response.data, UserSchema);

    return validatedResponseData;
  },

  findAll: async (QueryParams: QueryParams) => {
    const response = await ApiService.get<User[]>({
      endpoint: END_POINTS.findAll,
      query: QueryParams,
    });

    console.log("response", response);
    const validatedResponseData = validateResponseData<User[]>(response.data, z.array(UserSchema));

    return {
      items: validatedResponseData,
      meta: response.meta,
    };
  },

  agentList: async () => {
    const response = await ApiService.get<ListItem[]>({
      endpoint: END_POINTS.agentsList,
    });

    console.log("response", response);
    const validatedResponseData = validateResponseData<ListItem[]>(response.data, z.array(ListItemSchema));

    return validatedResponseData;
  },

  findOne: async (id: string) => {
    const response = await ApiService.get<User>({
      endpoint: END_POINTS.findOne(id),
    });

    const validatedResponseData = validateResponseData<User>(response.data, UserSchema);

    return validatedResponseData;
  },

  profile: async () => {
    const response = await ApiService.get<User>({
      endpoint: END_POINTS.profile,
    });

    console.log(response);
    const validatedResponseData = validateResponseData<User>(response.data, UserSchema);

    return validatedResponseData;
  },

  update: async (data: UserForm, id: number) => {
    const response = await ApiService.put<User>({
      endpoint: END_POINTS.update(id),
      body: data,
    });

    const validatedResponseData = validateResponseData<User>(response.data, UserSchema);

    return validatedResponseData;
  },

  delete: async (id: number) => {
    await ApiService.delete({
      endpoint: END_POINTS.delete(id),
    });
  },
};

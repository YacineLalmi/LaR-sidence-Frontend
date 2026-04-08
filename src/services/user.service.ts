import ApiService from "./api.service";
import { PaginatedResponse, QueryParams } from "@/lib/definitions";
import { validateResponseData } from "@/lib/utils";
import { ListItem, ListItemSchema } from "@/schemas/global.schema";
import { UserForm } from "@/schemas/users/user-form.schema";
import { User, UserSchema } from "@/schemas/users/user.schema";
import z from "zod";

const END_POINTS = {
  create: "/configurations/users",
  findMany: "/configurations/users",
  agentsList: "/lists/agents",
  profile: "/profile",
  findOne: (id: string) => `/configurations/users/${id}`,
  update: (id: string) => `/configurations/users/${id}`,
  updateColor: (id: string) => `/configurations/users/color/${id}`,
  delete: (id: string) => `/configurations/users/${id}`,
  deleteMany: `/configurations/users/many`,
};

export const UserService = {
  create: async (data: UserForm): Promise<User> => {
    const formedData = {
      ...data
    };
    const response = await ApiService.post<User>({
      endpoint: END_POINTS.create,
      body: formedData,
    });

    const validatedResponseData = validateResponseData<User>(response.data, UserSchema);

    return validatedResponseData;
  },

  findMany: async (QueryParams: QueryParams): Promise<PaginatedResponse<User>> => {
    const response = await ApiService.get<User[]>({
      endpoint: END_POINTS.findMany,
      query: QueryParams,
    });

    const validatedResponseData = validateResponseData<User[]>(response.data, z.array(UserSchema));

    return {
      data: validatedResponseData,
      meta: response.meta,
    };
  },

  agentList: async (needle: string): Promise<ListItem[]> => {
    const response = await ApiService.get<ListItem[]>({
      endpoint: END_POINTS.agentsList,
      query: { needle }
    });

    const validatedResponseData = validateResponseData<ListItem[]>(response.data, z.array(ListItemSchema));

    return validatedResponseData;
  },

  findOne: async (id: string): Promise<User> => {
    const response = await ApiService.get<User>({
      endpoint: END_POINTS.findOne(id),
    });

    const validatedResponseData = validateResponseData<User>(response.data, UserSchema);

    return validatedResponseData;
  },

  profile: async (): Promise<User> => {
    const response = await ApiService.get<User>({
      endpoint: END_POINTS.profile,
    });

    const validatedResponseData = validateResponseData<User>(response.data, UserSchema);

    return validatedResponseData;
  },

  update: async (data: UserForm, id: string): Promise<User> => {
    const response = await ApiService.put<User>({
      endpoint: END_POINTS.update(id),
      body: data,
    });

    const validatedResponseData = validateResponseData<User>(response.data, UserSchema);

    return validatedResponseData;
  },
  updateColor: async (data: { color_id: string }, id: string): Promise<User> => {
    const response = await ApiService.put<User>({
      endpoint: END_POINTS.updateColor(id),
      body: data,
    });

    const validatedResponseData = validateResponseData<User>(response.data, UserSchema);

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

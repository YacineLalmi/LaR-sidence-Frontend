import ApiService from "./api.service";
import { QueryParams } from "@/lib/definitions";
import { validateResponseData } from "@/lib/utils";
import { CreateOrUpdateUser, User, UserSchema } from "@/schemas/user.schema";
import z from "zod";

const END_POINTS = {
  create: "/users",
  findAll: "/users",
  findOne: (id: string) => `/users/${id}`,
  update: (id: string) => `/users/${id}`,
  delete: (id: string) => `/users/${id}`,
};

export const UserService = {
  create: async (data: CreateOrUpdateUser) => {
    const response = await ApiService.post<User>({
      endpoint: END_POINTS.create,
      body: data,
    });

    const validatedResponseData = validateResponseData<User>(response.data, UserSchema);

    return validatedResponseData;
  },

  findAll: async (QueryParams: QueryParams) => {
    const response = await ApiService.get<User[]>({
      endpoint: END_POINTS.findAll,
      query: QueryParams,
    });

    console.log(response);
    const validatedResponseData = validateResponseData<User[]>(response.data, z.array(UserSchema));

    return {
      items: validatedResponseData,
      meta: response.meta,
    };
  },

  findOne: async (id: string) => {
    const response = await ApiService.get<User>({
      endpoint: END_POINTS.findOne(id),
    });

    const validatedResponseData = validateResponseData<User>(response.data, UserSchema);

    return validatedResponseData;
  },

  update: async (data: CreateOrUpdateUser, id: string) => {
    const response = await ApiService.put<User>({
      endpoint: END_POINTS.update(id),
      body: data,
    });

    const validatedResponseData = validateResponseData<User>(response.data, UserSchema);

    return validatedResponseData;
  },

  delete: async (id: string) => {
    await ApiService.delete({
      endpoint: END_POINTS.delete(id),
    });
  },
};

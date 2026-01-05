import ApiService from "./api.service";
import { QueryParams } from "@/lib/definitions";
import { validateResponseData } from "@/lib/utils";
import { ListItem, ListItemSchema } from "@/schemas/global.schema";
import { Profile, ProfileSchema } from "@/schemas/users/profile.schema";
import { UserDetails, UserDetailsSchema } from "@/schemas/users/user-details.schema";
import { UserForm } from "@/schemas/users/user-form.schema";
import { User, UserSchema } from "@/schemas/users/user.schema";
import z from "zod";

const END_POINTS = {
  create: "/configurations/users",
  findAll: "/configurations/users",
  agentsList: "/lists/agents",
  profile: "/profile",
  findOne: (id: string) => `/configurations/users/${id}`,
  update: (id: string) => `/configurations/users/${id}`,
  delete: (id: string) => `/configurations/users/${id}`,
};

export const UserService = {
  create: async (data: UserForm) => {
    const response = await ApiService.post<User>({
      endpoint: END_POINTS.create,
      body: data,
    });

    const validatedResponseData = validateResponseData<User>(response.data, UserDetailsSchema);

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
    const response = await ApiService.get<UserDetails>({
      endpoint: END_POINTS.findOne(id),
    });

    const validatedResponseData = validateResponseData<UserDetails>(response.data, UserDetailsSchema);

    return validatedResponseData;
  },

  profile: async () => {
    const response = await ApiService.get<Profile>({
      endpoint: END_POINTS.profile,
    });

    console.log(response);
    const validatedResponseData = validateResponseData<Profile>(response.data, ProfileSchema);

    return validatedResponseData;
  },

  update: async (id: string, data: UserForm) => {
    const response = await ApiService.put<User>({
      endpoint: END_POINTS.update(id),
      body: data,
    });

    const validatedResponseData = validateResponseData<User>(response.data, UserDetailsSchema);

    return validatedResponseData;
  },

  delete: async (id: string) => {
    await ApiService.delete({
      endpoint: END_POINTS.delete(id),
    });
  },
};

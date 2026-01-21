import { validateResponseData } from "@/lib/utils";
import ApiService from "./api.service";
import z from "zod";

const END_POINTS = {
  permissions: "/profile/permissions",
};

export const ProfileService = {
  permissions: async (): Promise<string[]> => {
    const response = await ApiService.get<string[]>({
      endpoint: END_POINTS.permissions,
    });

    const validatedResponseData = validateResponseData<string[]>(response.data, z.array(z.string()));

    return validatedResponseData;
  },
};

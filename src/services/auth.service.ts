import { LoginRequestData, LoginResponseData, LoginResponseDataSchema } from "@/schemas/auth.schema";
import ApiService from "./api.service";
import { ApiResponse } from "@/lib/definitions";
import { validateResponseData } from "@/lib/utils";

const END_POINTS = {
  login: "/auth/login",
  logout: "/auth/logout",
};

export const authService = {
  login: async (data: LoginRequestData) => {
    const response = await ApiService.post<ApiResponse>({
      endpoint: END_POINTS.login,
      body: data,
    });

    const validatedResponseData = validateResponseData<LoginResponseData>(response.data, LoginResponseDataSchema);

    return validatedResponseData;
  },

  logout: async (): Promise<void> => {
    await ApiService.post({ endpoint: END_POINTS.logout });
  },
};

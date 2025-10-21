import ApiService from "./api.service";
import { validateResponseData } from "@/lib/utils";
import { LoginFormData, LoginResponse, LoginResponseSchema } from "@/schemas/auth.schema";

const END_POINTS = {
  login: "/auth/login",
  refresh: "/auth/refresh",
  logout: "/auth/logout",
};

export const authService = {
  login: async (data: LoginFormData) => {
    const response = await ApiService.post<LoginResponse>({
      endpoint: END_POINTS.login,
      body: data,
    });

    const validatedResponseData = validateResponseData<LoginResponse>(response.data, LoginResponseSchema);

    return validatedResponseData;
  },

  refresh: async (refresh_token: string) => {
    const response = await ApiService.get<LoginResponse>({
      endpoint: END_POINTS.refresh,
      query: { refresh_token },
    });
    const validatedResponseData = validateResponseData<LoginResponse>(response.data, LoginResponseSchema);
    return validatedResponseData;
  },

  logout: async (): Promise<void> => {
    await ApiService.post({ endpoint: END_POINTS.logout });
  },
};

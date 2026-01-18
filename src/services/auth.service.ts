import ApiService from "./api.service";
import { validateResponseData } from "@/lib/utils";
import { LoginFormData, LoginResponse, LoginResponseSchema } from "@/schemas/auth/auth.schema";
import { ForgotPasswordDataForm } from "@/schemas/auth/forget-password-form.schema";
import { ResetPasswordDataForm } from "@/schemas/auth/reset-password-form.schema";

const END_POINTS = {
  login: "/auth/login",
  refresh: "/auth/refresh",
  logout: "/auth/logout",
  forgotPassword: "/auth/forgot-password",
  resetPassword: "/auth/reset-password",
};

export const AuthService = {
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

  forgotPassword: async (data: ForgotPasswordDataForm): Promise<void> => {
    await ApiService.post({ endpoint: END_POINTS.forgotPassword, body: data });
  },

  resetPassword: async (data: ResetPasswordDataForm): Promise<void> => {
    await ApiService.post({ endpoint: END_POINTS.resetPassword, body: data });
  },
};

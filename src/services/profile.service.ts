import ApiService from "./api.service";
import { PasswordResetForm } from "@/schemas/profile/PasswordReset.schema";

const END_POINTS = {
  passwordReset: "/profile/resetPassword",
};

export const ProfileService = {
  passwordReset: async (data: PasswordResetForm) => {
    const response = await ApiService.post({
      endpoint: END_POINTS.passwordReset,
      body: data,
    });

    return response;
  },
};

"use server";

import { handleServerActionError } from "@/lib/utils";
import { FormState } from "@/lib/definitions";
import { clearCookies, setCookie } from "@/lib/server.helper";
import { AuthService } from "@/services/auth.service";

export async function logoutAction(): Promise<FormState> {
  try {
    await AuthService.logout();
    await clearCookies();
    return {
      isOk: true,
    };
  } catch (error) {
    const result = handleServerActionError(error);
    return {
      isOk: false,
      ...result,
    };
  }
}

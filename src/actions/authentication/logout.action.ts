"use server";

import { FormState } from "@/lib/definitions";
import { clearCookies, handleServerActionError, setCookie } from "@/lib/server.helper";
import { AuthService } from "@/services/auth.service";

export async function logoutAction(): Promise<FormState> {
  try {
    await AuthService.logout();
    await clearCookies();
    return {
      isOk: true,
    };
  } catch (error) {
    const result = await handleServerActionError(error);
    return {
      isOk: false,
      ...result,
    };
  }
}

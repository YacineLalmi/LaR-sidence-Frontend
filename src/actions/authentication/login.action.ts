"use server";

import { FormState } from "@/lib/definitions";
import { AuthService } from "@/services/auth.service";
import { differenceInSeconds } from "date-fns";
import { handleServerActionError, setCookie } from "@/lib/server.helper";
import { LoginFormData } from "@/schemas/auth/auth.schema";
import { COOKIES_KEYS } from "@/constants/cookies-keys";

export async function loginAction(data: LoginFormData): Promise<FormState> {
  try {
    const response = await AuthService.login(data);
    await setCookie({
      key: COOKIES_KEYS.ACCESS_TOKEN,
      value: response.access_token,
      expires: response.access_token_expires_at,
      maxAge: differenceInSeconds(response.access_token_expires_at, new Date()),
      sameSite: "lax",
    });

    await setCookie({
      key: COOKIES_KEYS.REFRESH_TOKEN,
      value: response.refresh_token,
      expires: response.refresh_token_expires_at,
      maxAge: differenceInSeconds(response.refresh_token_expires_at, new Date()),
      sameSite: "lax",
    });

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

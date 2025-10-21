"use server";

import { handleServerActionError } from "@/lib/utils";
import { FormState } from "@/lib/definitions";
import { authService } from "@/services/auth.service";
import { differenceInSeconds } from "date-fns";
import { LoginFormData } from "@/schemas/auth.schema";
import { setCookie } from "@/lib/server.helper";

export async function loginAction(data: LoginFormData): Promise<FormState> {
  try {
    const response = await authService.login(data);
    await setCookie({
      key: "access_token",
      value: response.access_token,
      expires: response.access_token_expires_at,
      maxAge: differenceInSeconds(response.access_token_expires_at, new Date()),
    });

    await setCookie({
      key: "refresh_token",
      value: response.refresh_token,
      expires: response.refresh_token_expires_at,
      maxAge: differenceInSeconds(response.refresh_token_expires_at, new Date()),
    });

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

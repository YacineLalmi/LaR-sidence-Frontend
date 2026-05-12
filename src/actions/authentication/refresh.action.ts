'use server'

import { COOKIES_KEYS } from "@/constants/cookies-keys";
import { FormState } from "@/lib/definitions";
import { UnauthorizedError } from "@/lib/errors";
import { getCookie, setCookie } from "@/lib/server.helper";
import { AuthService } from "@/services/auth.service";
import { differenceInSeconds } from "date-fns";

export async function refreshTokenAction(): Promise<FormState> {
  try {

    const refresh_token = await getCookie(COOKIES_KEYS.REFRESH_TOKEN)
    if (!refresh_token) throw new UnauthorizedError()

    const response = await AuthService.refresh(refresh_token);

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

    return { isOk: true };
  } catch (error) {
    return { isOk: false };
  }
}

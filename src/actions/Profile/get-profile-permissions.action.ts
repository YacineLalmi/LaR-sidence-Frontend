"use server";

import { COOKIES_KEYS } from "@/constants/cookies-keys";
import { getCookie, setCookie } from "@/lib/server.helper";
import { handleServerActionError } from "@/lib/server.helper";;
import { ProfileService } from "@/services/profile.service";
import { addMinutes, differenceInSeconds } from "date-fns";

export async function getProfilePermissionsAction(): Promise<string[]> {
  try {
    const existingPermissions = await getCookie(COOKIES_KEYS.USER_PERMISSIONS);
    if (existingPermissions) {
      return JSON.parse(existingPermissions) as string[];
    }
    const response = await ProfileService.permissions();

    await setCookie({
      key: COOKIES_KEYS.USER_PERMISSIONS,
      value: JSON.stringify(response),
      expires: addMinutes(new Date(), 30),
      maxAge: differenceInSeconds(addMinutes(new Date(), 30), new Date()),
      sameSite: "lax",
    });

    return response;
  } catch (error) {
    console.error(error);
    handleServerActionError(error);
    return [];
  }
}

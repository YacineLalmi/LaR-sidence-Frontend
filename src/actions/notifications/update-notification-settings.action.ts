"use server";

import { FormState } from "@/lib/definitions";
import { COOKIES_KEYS } from "@/constants/cookies-keys";
import { getCookie, handleServerActionError } from "@/lib/server.helper";
import { NotificationSetting } from "@/schemas/notifications/notification.schema";

const baseUrl = process.env.BACKEND_API_URL || "http://localhost:8000/api";

export async function updateNotificationSettingsAction(settings: NotificationSetting[]): Promise<FormState> {
  try {
    const token = await getCookie(COOKIES_KEYS.ACCESS_TOKEN);
    if (!token) return { isOk: false, errorMessage: "Non authentifié" };

    const res = await fetch(`${baseUrl}/notification-settings`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "X-Requested-With": "XMLHttpRequest",
      },
      body: JSON.stringify({ settings }),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      return { isOk: false, errorMessage: (body as { message?: string }).message || "Mise à jour impossible" };
    }

    return { isOk: true };
  } catch (error) {
    const result = await handleServerActionError(error);
    return { isOk: false, errorMessage: result.errorMessage, errorCode: result.errorCode };
  }
}


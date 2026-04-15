"use server";

import { FormState } from "@/lib/definitions";
import { COOKIES_KEYS } from "@/constants/cookies-keys";
import { getCookie, handleServerActionError } from "@/lib/server.helper";

const baseUrl = process.env.BACKEND_API_URL || "http://localhost:8000/api";

export async function markNotificationReadAction(notificationId: string | number): Promise<FormState> {
  const id = encodeURIComponent(String(notificationId));
  try {
    const token = await getCookie(COOKIES_KEYS.ACCESS_TOKEN);
    if (!token) return { isOk: false, errorMessage: "Non authentifié" };

    const res = await fetch(`${baseUrl}/notifications/${id}/read`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
        "X-Requested-With": "XMLHttpRequest",
      },
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      return { isOk: false, errorMessage: (body as { message?: string }).message || "Impossible" };
    }

    return { isOk: true };
  } catch (error) {
    const result = await handleServerActionError(error);
    return { isOk: false, errorMessage: result.errorMessage, errorCode: result.errorCode };
  }
}

export async function markAllNotificationsReadAction(): Promise<FormState> {
  try {
    const token = await getCookie(COOKIES_KEYS.ACCESS_TOKEN);
    if (!token) return { isOk: false, errorMessage: "Non authentifié" };

    const res = await fetch(`${baseUrl}/notifications/mark-all-read`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
        "X-Requested-With": "XMLHttpRequest",
      },
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      return { isOk: false, errorMessage: (body as { message?: string }).message || "Impossible" };
    }

    return { isOk: true };
  } catch (error) {
    const result = await handleServerActionError(error);
    return { isOk: false, errorMessage: result.errorMessage, errorCode: result.errorCode };
  }
}

export async function deleteNotificationAction(notificationId: string | number): Promise<FormState> {
  const id = encodeURIComponent(String(notificationId));
  try {
    const token = await getCookie(COOKIES_KEYS.ACCESS_TOKEN);
    if (!token) return { isOk: false, errorMessage: "Non authentifié" };

    const res = await fetch(`${baseUrl}/notifications/${id}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
        "X-Requested-With": "XMLHttpRequest",
      },
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      return { isOk: false, errorMessage: (body as { message?: string }).message || "Suppression impossible" };
    }

    return { isOk: true };
  } catch (error) {
    const result = await handleServerActionError(error);
    return { isOk: false, errorMessage: result.errorMessage, errorCode: result.errorCode };
  }
}


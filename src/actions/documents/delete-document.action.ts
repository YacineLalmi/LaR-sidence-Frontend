"use server";

import { FormState } from "@/lib/definitions";
import { getCookie, handleServerActionError } from "@/lib/server.helper";
import { COOKIES_KEYS } from "@/constants/cookies-keys";

const baseUrl = process.env.BACKEND_API_URL || "http://localhost:8000/api";

export async function deleteDocumentAction(fileId: string | number): Promise<FormState> {
  const id = encodeURIComponent(String(fileId));
  try {
    const token = await getCookie(COOKIES_KEYS.ACCESS_TOKEN);
    if (!token) {
      return { isOk: false, errorMessage: "Non authentifié" };
    }

    const res = await fetch(`${baseUrl}/files/${id}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
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

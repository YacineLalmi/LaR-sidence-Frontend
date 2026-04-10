"use server";

import { FormState } from "@/lib/definitions";
import { getCookie, handleServerActionError } from "@/lib/server.helper";
import { COOKIES_KEYS } from "@/constants/cookies-keys";

const baseUrl = process.env.BACKEND_API_URL || "http://localhost:8000/api";

export async function shareDocumentEmailAction(fileId: string | number, email: string): Promise<FormState> {
  const id = encodeURIComponent(String(fileId));
  try {
    const token = await getCookie(COOKIES_KEYS.ACCESS_TOKEN);
    if (!token) {
      return { isOk: false, errorMessage: "Non authentifié" };
    }

    const res = await fetch(`${baseUrl}/document-library/${id}/share-email`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "X-Requested-With": "XMLHttpRequest",
      },
      body: JSON.stringify({ email }),
    });

    const body = await res.json().catch(() => ({}));

    if (!res.ok) {
      return {
        isOk: false,
        errorMessage: (body as { message?: string }).message || "Envoi impossible",
      };
    }

    return { isOk: true };
  } catch (error) {
    const result = await handleServerActionError(error);
    return { isOk: false, errorMessage: result.errorMessage, errorCode: result.errorCode };
  }
}

"use server";

import { FormState } from "@/lib/definitions";
import { getCookie, handleServerActionError } from "@/lib/server.helper";
import { COOKIES_KEYS } from "@/constants/cookies-keys";

const baseUrl = process.env.BACKEND_API_URL || "http://localhost:8000/api";

export async function uploadDocumentAction(formData: FormData): Promise<FormState<{ id?: string }>> {
  try {
    const token = await getCookie(COOKIES_KEYS.ACCESS_TOKEN);
    if (!token) {
      return { isOk: false, errorMessage: "Non authentifié" };
    }

    const res = await fetch(`${baseUrl}/document-library/upload`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const body = await res.json().catch(() => ({}));
    if (!res.ok) {
      return { isOk: false, errorMessage: (body as { message?: string }).message || "Échec du téléversement" };
    }

    const data = (body as { data?: { id?: string } }).data;

    return { isOk: true, data: { id: data?.id } };
  } catch (error) {
    const result = await handleServerActionError(error);
    return { isOk: false, errorMessage: result.errorMessage, errorCode: result.errorCode };
  }
}

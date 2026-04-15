"use server";

import { FormState } from "@/lib/definitions";
import { getCookie, handleServerActionError } from "@/lib/server.helper";
import { COOKIES_KEYS } from "@/constants/cookies-keys";

const baseUrl = process.env.BACKEND_API_URL || "http://localhost:8000/api";

export async function deleteFolderAction(folderId: string | number): Promise<FormState> {
  const id = encodeURIComponent(String(folderId));
  try {
    const token = await getCookie(COOKIES_KEYS.ACCESS_TOKEN);
    if (!token) {
      return { isOk: false, errorMessage: "Non authentifié" };
    }

    const res = await fetch(`${baseUrl}/folders/${id}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const body = await res.json().catch(() => ({}));
    if (!res.ok) {
      return {
        isOk: false,
        errorMessage: (body as { message?: string }).message || "Impossible de supprimer le dossier",
      };
    }

    return { isOk: true };
  } catch (error) {
    const result = await handleServerActionError(error);
    return { isOk: false, errorMessage: result.errorMessage, errorCode: result.errorCode };
  }
}

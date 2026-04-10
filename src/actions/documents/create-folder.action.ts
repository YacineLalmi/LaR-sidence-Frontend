"use server";

import { FormState } from "@/lib/definitions";
import { getCookie, handleServerActionError } from "@/lib/server.helper";
import { COOKIES_KEYS } from "@/constants/cookies-keys";

const baseUrl = process.env.BACKEND_API_URL || "http://localhost:8000/api";

export async function createFolderAction(name: string): Promise<FormState<{ id?: number }>> {
  const trimmed = name.trim();
  if (!trimmed) {
    return { isOk: false, errorMessage: "Le nom du dossier est requis." };
  }

  try {
    const token = await getCookie(COOKIES_KEYS.ACCESS_TOKEN);
    if (!token) {
      return { isOk: false, errorMessage: "Non authentifié" };
    }

    const res = await fetch(`${baseUrl}/folders`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name: trimmed }),
    });

    const body = await res.json().catch(() => ({}));
    if (!res.ok) {
      return {
        isOk: false,
        errorMessage: (body as { message?: string }).message || "Impossible de créer le dossier",
      };
    }

    const data = (body as { data?: { id?: number } }).data;
    return { isOk: true, data: { id: data?.id } };
  } catch (error) {
    const result = await handleServerActionError(error);
    return { isOk: false, errorMessage: result.errorMessage, errorCode: result.errorCode };
  }
}

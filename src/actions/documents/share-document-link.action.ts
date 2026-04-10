"use server";

import { getCookie, handleServerActionError } from "@/lib/server.helper";
import { COOKIES_KEYS } from "@/constants/cookies-keys";

const baseUrl = process.env.BACKEND_API_URL || "http://localhost:8000/api";

export type ShareLinkResult =
  | { ok: true; url: string }
  | { ok: false; message: string };

export async function shareDocumentLinkAction(fileId: string | number): Promise<ShareLinkResult> {
  const id = encodeURIComponent(String(fileId));
  try {
    const token = await getCookie(COOKIES_KEYS.ACCESS_TOKEN);
    if (!token) {
      return { ok: false, message: "Non authentifié" };
    }

    const res = await fetch(`${baseUrl}/document-library/${id}/share-link`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
        "X-Requested-With": "XMLHttpRequest",
      },
    });

    const body = (await res.json().catch(() => ({}))) as { success?: boolean; data?: { url?: string }; message?: string };

    if (!res.ok || !body.data?.url) {
      return { ok: false, message: body.message || "Lien indisponible" };
    }

    return { ok: true, url: body.data.url };
  } catch (error) {
    const result = await handleServerActionError(error);
    return { ok: false, message: result.errorMessage };
  }
}

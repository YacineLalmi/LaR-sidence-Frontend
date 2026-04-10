"use server";

import { getCookie, handleServerActionError } from "@/lib/server.helper";
import { COOKIES_KEYS } from "@/constants/cookies-keys";

const baseUrl = process.env.BACKEND_API_URL || "http://localhost:8000/api";

export type BulkDownloadResult =
  | { ok: true; base64: string; filename: string }
  | { ok: false; message: string };

export async function bulkDownloadDocumentsAction(ids: string[]): Promise<BulkDownloadResult> {
  try {
    const token = await getCookie(COOKIES_KEYS.ACCESS_TOKEN);
    if (!token) {
      return { ok: false, message: "Non authentifié" };
    }

    const res = await fetch(`${baseUrl}/document-library/bulk-download`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "X-Requested-With": "XMLHttpRequest",
      },
      body: JSON.stringify({ ids }),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      return { ok: false, message: (body as { message?: string }).message || "Téléchargement impossible" };
    }

    const buf = await res.arrayBuffer();
    const base64 = Buffer.from(buf).toString("base64");

    return { ok: true, base64, filename: "documents.zip" };
  } catch (error) {
    const result = await handleServerActionError(error);
    return { ok: false, message: result.errorMessage || "Erreur" };
  }
}

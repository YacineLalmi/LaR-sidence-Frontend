"use server";

import { getCookie } from "@/lib/server.helper";
import { COOKIES_KEYS } from "@/constants/cookies-keys";

const baseUrl = process.env.BACKEND_API_URL || "http://localhost:8000/api";

export type PreviewPayload =
  | { ok: true; base64: string; mimeType: string }
  | { ok: false; message: string };

export async function loadDocumentPreviewAction(fileId: string | number): Promise<PreviewPayload> {
  const id = encodeURIComponent(String(fileId));
  try {
    const token = await getCookie(COOKIES_KEYS.ACCESS_TOKEN);
    if (!token) {
      return { ok: false, message: "Non authentifié" };
    }

    const res = await fetch(`${baseUrl}/document-library/${id}/preview`, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
        "X-Requested-With": "XMLHttpRequest",
      },
    });

    if (!res.ok) {
      const errBody = await res.json().catch(() => null) as { message?: string } | null;
      return {
        ok: false,
        message: errBody?.message || "Prévisualisation indisponible",
      };
    }

    const buf = await res.arrayBuffer();
    const base64 = Buffer.from(buf).toString("base64");
    const mimeType = res.headers.get("content-type") || "application/octet-stream";

    return { ok: true, base64, mimeType };
  } catch {
    return { ok: false, message: "Erreur réseau" };
  }
}

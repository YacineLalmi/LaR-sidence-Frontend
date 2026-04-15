"use server";

import { getCookie } from "@/lib/server.helper";
import { COOKIES_KEYS } from "@/constants/cookies-keys";

const baseUrl = process.env.BACKEND_API_URL || "http://localhost:8000/api";

export type DownloadBlobResult =
  | { ok: true; base64: string; filename: string; mimeType: string }
  | { ok: false; message: string };

export async function downloadDocumentBlobAction(fileId: string | number, fallbackName: string): Promise<DownloadBlobResult> {
  const id = encodeURIComponent(String(fileId));
  try {
    const token = await getCookie(COOKIES_KEYS.ACCESS_TOKEN);
    if (!token) {
      return { ok: false, message: "Non authentifié" };
    }

    const res = await fetch(`${baseUrl}/files/download/${id}`, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
        "X-Requested-With": "XMLHttpRequest",
      },
    });

    if (!res.ok) {
      return { ok: false, message: "Téléchargement impossible" };
    }

    const cd = res.headers.get("content-disposition") || "";
    let filename = fallbackName;
    const match = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(cd);
    if (match?.[1]) {
      filename = match[1].replace(/['"]/g, "").trim();
    }

    const buf = await res.arrayBuffer();
    const base64 = Buffer.from(buf).toString("base64");
    const mimeType = res.headers.get("content-type") || "application/octet-stream";

    return { ok: true, base64, filename, mimeType };
  } catch {
    return { ok: false, message: "Erreur réseau" };
  }
}

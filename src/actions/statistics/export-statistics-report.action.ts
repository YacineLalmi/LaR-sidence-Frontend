"use server";

import { getCookie } from "@/lib/server.helper";
import { COOKIES_KEYS } from "@/constants/cookies-keys";
import { StatisticsFilters } from "@/schemas/statistics/statistics.schema";

const baseUrl = process.env.BACKEND_API_URL || "http://localhost:8000/api";

export type ExportStatisticsResult =
  | { ok: true; base64: string; filename: string; mimeType: string }
  | { ok: false; message: string };

export async function exportStatisticsReportAction(
  section: string,
  format: "csv" | "xlsx" | "pdf",
  filters: StatisticsFilters
): Promise<ExportStatisticsResult> {
  try {
    const token = await getCookie(COOKIES_KEYS.ACCESS_TOKEN);
    if (!token) {
      return { ok: false, message: "Non authentifié" };
    }

    const res = await fetch(`${baseUrl}/reports/export`, {
      method: "POST",
      headers: {
        Accept: "application/octet-stream",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        section,
        format,
        ...filters,
      }),
    });

    if (!res.ok) {
      let message = "Export impossible";
      try {
        const j = await res.json();
        if (typeof (j as { message?: string }).message === "string") {
          message = (j as { message: string }).message;
        }
      } catch {
        /* ignore */
      }
      return { ok: false, message };
    }

    const cd = res.headers.get("content-disposition") || "";
    let filename = `rapport-${section}.${format}`;
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

"use server";

import { COOKIES_KEYS } from "@/constants/cookies-keys";
import { ResponseValidationError } from "@/lib/errors";
import { getCookie } from "@/lib/server.helper";
import { validateResponseData } from "@/lib/utils";
import { getStatisticsResponseSchema } from "@/schemas/statistics/response-schemas";
import type { StatisticsFilters } from "@/schemas/statistics/statistics.schema";
import { buildStatisticsQuery } from "@/services/statistics.service";

const baseUrl = process.env.BACKEND_API_URL || "http://localhost:8000/api";

export type FetchStatisticsSectionResult =
  | { ok: true; data: Record<string, unknown> }
  | { ok: false; kind: "unauthorized" | "forbidden" | "validation" | "network"; message?: string };

/**
 * Charge une section statistiques avec le jeton serveur (cookie httpOnly chiffré).
 * Les appels ApiService depuis le navigateur n’envoient pas d’Authorization — cette action est requise pour les pages client.
 */
export async function fetchStatisticsSectionAction(
  section: string,
  filters: StatisticsFilters
): Promise<FetchStatisticsSectionResult> {
  const token = await getCookie(COOKIES_KEYS.ACCESS_TOKEN);
  if (!token) {
    return { ok: false, kind: "unauthorized" };
  }

  const qs = buildStatisticsQuery(filters);
  const url = `${baseUrl}/statistics/${encodeURIComponent(section)}${qs ? `?${qs}` : ""}`;

  let res: Response;
  try {
    res = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });
  } catch {
    return { ok: false, kind: "network", message: "Erreur réseau" };
  }

  if (res.status === 401) {
    return { ok: false, kind: "unauthorized" };
  }
  if (res.status === 403) {
    return { ok: false, kind: "forbidden" };
  }
  if (!res.ok) {
    let message = `HTTP ${res.status}`;
    try {
      const j = (await res.json()) as { message?: string };
      if (typeof j.message === "string") message = j.message;
    } catch {
      /* ignore */
    }
    return { ok: false, kind: "network", message };
  }

  let body: unknown;
  try {
    body = await res.json();
  } catch {
    return { ok: false, kind: "network", message: "Réponse invalide" };
  }

  const payload =
    body !== null && typeof body === "object" && "data" in body
      ? (body as { data: unknown }).data
      : undefined;

  if (payload === undefined || typeof payload !== "object" || payload === null) {
    return { ok: false, kind: "validation", message: "Réponse statistiques vide" };
  }

  try {
    const schema = getStatisticsResponseSchema(section);
    const data = validateResponseData<Record<string, unknown>>(payload, schema);
    return { ok: true, data };
  } catch (e) {
    const message =
      e instanceof ResponseValidationError
        ? e.message
        : e instanceof Error
          ? e.message
          : "Validation de la réponse impossible";
    return { ok: false, kind: "validation", message };
  }
}

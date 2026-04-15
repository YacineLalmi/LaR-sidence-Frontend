import ApiService from "./api.service";
import { getStatisticsResponseSchema } from "@/schemas/statistics/response-schemas";
import { StatisticsFilters } from "@/schemas/statistics/statistics.schema";
import { validateResponseData } from "@/lib/utils";

function appendArrayParam(params: URLSearchParams, key: string, values: string[] | undefined) {
  if (!values?.length) return;
  const k = key.endsWith("[]") ? key : `${key}[]`;
  values.forEach((v) => params.append(k, v));
}

export function buildStatisticsQuery(filters: StatisticsFilters): string {
  const p = new URLSearchParams();
  p.set("date_from", filters.date_from);
  p.set("date_to", filters.date_to);
  p.set("granularity", filters.granularity ?? "month");
  if (filters.breakdown) p.set("breakdown", filters.breakdown);
  appendArrayParam(p, "agent_ids", filters.agent_ids);
  appendArrayParam(p, "bien_type_ids", filters.bien_type_ids);
  appendArrayParam(p, "bien_status_ids", filters.bien_status_ids);
  appendArrayParam(p, "wilaya_ids", filters.wilaya_ids);
  appendArrayParam(p, "commune_ids", filters.commune_ids);
  appendArrayParam(p, "offer_status_ids", filters.offer_status_ids);
  appendArrayParam(p, "demand_status_ids", filters.demand_status_ids);
  appendArrayParam(p, "payment_status_ids", filters.payment_status_ids);
  appendArrayParam(p, "client_source_ids", filters.client_source_ids);
  appendArrayParam(p, "demand_source_ids", filters.demand_source_ids);
  if (filters.exclusivity !== undefined) {
    p.set("exclusivity", filters.exclusivity ? "true" : "false");
  }
  return p.toString();
}

const ENDPOINTS = {
  section: (name: string, qs: string) => `/statistics/${name}${qs ? `?${qs}` : ""}`,
};

export const StatisticsService = {
  async fetchSection(section: string, filters: StatisticsFilters): Promise<Record<string, unknown>> {
    const qs = buildStatisticsQuery(filters);
    const res = await ApiService.get<Record<string, unknown>>({
      endpoint: ENDPOINTS.section(section, qs),
    });
    if (res.data === undefined) {
      throw new Error("Réponse statistiques vide");
    }
    const schema = getStatisticsResponseSchema(section);
    return validateResponseData(res.data, schema);
  },
};

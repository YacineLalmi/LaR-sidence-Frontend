import ApiService from "./api.service";
import { getStatisticsResponseSchema } from "@/schemas/statistics/response-schemas";
import { StatisticsFilters } from "@/schemas/statistics/statistics.schema";
import { validateResponseData } from "@/lib/utils";
import { BienDistribution, BienDistributionSchema } from "@/schemas/dashboard/bien-distribution.schema";
import z from "zod";
import { ClientFilterStatsForm } from "@/schemas/clients/client-filter-stats-form.schema";
import { DemandFilterStatsForm } from "@/schemas/demands/demand-filter-stats-form.schema";
import { OfferFilterStatsForm } from "@/schemas/offers/offer-filter-stats-form.schema";
import { BillingFilterStatsForm } from "@/schemas/bills/bill-filter-stats-form.schema";

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

const END_POINTS = {
  section: (name: string, qs: string) => `/statistics/${name}${qs ? `?${qs}` : ""}`,
  biens: "/statistics/biens",
  clients: "/statistics/clients",
  demands: "/statistics/demands",
  offers: "/statistics/offers",
  billing: "/statistics/billing"
};

export const StatisticsService = {
  async fetchSection(section: string, filters: StatisticsFilters): Promise<Record<string, unknown>> {
    const qs = buildStatisticsQuery(filters);
    const res = await ApiService.get<Record<string, unknown>>({
      endpoint: END_POINTS.section(section, qs),
    });
    if (res.data === undefined) {
      throw new Error("Réponse statistiques vide");
    }
    const schema = getStatisticsResponseSchema(section);
    return validateResponseData(res.data, schema);
  },

  getBiens: async (groupBy: string) => {
    const response = await ApiService.get<BienDistribution[]>({
      endpoint: END_POINTS.biens,
      query: { groupBy }
    });
    const validatedResponseData = validateResponseData<BienDistribution[]>(response.data, z.array(BienDistributionSchema));

    return validatedResponseData;
  },

  getClients: async (groupBy: string, filters: ClientFilterStatsForm) => {
    const response = await ApiService.get<BienDistribution[]>({
      endpoint: END_POINTS.clients,
      query: { groupBy, ...filters }
    });
    const validatedResponseData = validateResponseData<BienDistribution[]>(response.data, z.array(BienDistributionSchema));

    return validatedResponseData;
  },

  getDemands: async (groupBy: string, filters: DemandFilterStatsForm) => {
    const response = await ApiService.get<BienDistribution[]>({
      endpoint: END_POINTS.demands,
      query: { groupBy, ...filters }
    });
    const validatedResponseData = validateResponseData<BienDistribution[]>(response.data, z.array(BienDistributionSchema));

    return validatedResponseData;
  },

  getOffers: async (groupBy: string, filters: OfferFilterStatsForm) => {
    const response = await ApiService.get<BienDistribution[]>({
      endpoint: END_POINTS.offers,
      query: { groupBy, ...filters }
    });
    const validatedResponseData = validateResponseData<BienDistribution[]>(response.data, z.array(BienDistributionSchema));

    return validatedResponseData;
  },

  getBilling: async (groupBy: string, filters: BillingFilterStatsForm) => {
    const response = await ApiService.get<BienDistribution[]>({
      endpoint: END_POINTS.offers,
      query: { groupBy, ...filters }
    });
    const validatedResponseData = validateResponseData<BienDistribution[]>(response.data, z.array(BienDistributionSchema));

    return validatedResponseData;
  },
};

import { z } from "zod";

/** Valeurs numériques parfois sérialisées en chaîne par l’API / JSON. */
const distribution = z.object({
  labels: z.array(z.string()),
  values: z.array(z.coerce.number()),
});

const meta = z
  .object({
    date_from: z.string().optional(),
    date_to: z.string().optional(),
    granularity: z.string().optional(),
  })
  .passthrough();

export const statisticsBiensResponseSchema = z
  .object({
    meta: meta.optional(),
    by_type: distribution.optional(),
    by_status: distribution.optional(),
    by_exclusivity: z.array(z.object({ exclusivity: z.boolean(), count: z.number() })).optional(),
    by_wilaya: z
      .array(z.object({ wilaya_id: z.union([z.number(), z.string()]), label: z.string(), count: z.number() }))
      .optional(),
    created_in_period: distribution.optional(),
    portfolio_evolution: z
      .object({
        labels: z.array(z.string()),
        new_biens: z.array(z.coerce.number()),
        sold: z.array(z.coerce.number()),
        rented: z.array(z.coerce.number()),
      })
      .optional(),
  })
  .passthrough();

export const statisticsOffersResponseSchema = z
  .object({
    meta: meta.optional(),
    counts_by_status: z
      .array(
        z.object({
          status_id: z.union([z.string(), z.number()]).transform(String),
          label: z.string(),
          count: z.coerce.number(),
        })
      )
      .optional(),
    series_by_period: distribution.optional(),
    conversion_rate_series: z
      .object({
        labels: z.array(z.string()),
        rates: z.array(z.coerce.number()),
        created: z.array(z.coerce.number()),
        successes: z.array(z.coerce.number()),
      })
      .optional(),
    avg_days_to_success_series: z
      .object({
        labels: z.array(z.string()),
        values: z.array(z.number().nullable()),
      })
      .optional(),
    by_client_source: z
      .array(z.object({ source_id: z.string().nullable(), label: z.string(), count: z.coerce.number() }))
      .optional(),
  })
  .passthrough();

export const statisticsClientsResponseSchema = z
  .object({
    meta: meta.optional(),
    new_clients_series: distribution.optional(),
    by_source: z
      .array(z.object({ source_id: z.string().nullable(), label: z.string(), count: z.number() }))
      .optional(),
  })
  .passthrough();

export const statisticsDemandsResponseSchema = z
  .object({
    meta: meta.optional(),
    by_status: z.array(z.object({ id: z.string().nullable(), label: z.string(), count: z.number() })).optional(),
    by_source: z
      .array(z.object({ source_id: z.string().nullable(), label: z.string(), count: z.number() }))
      .optional(),
    series: distribution.optional(),
    matching_breakdown: z.object({ labels: z.array(z.string()), values: z.array(z.number()) }).optional(),
  })
  .passthrough();

export const statisticsAgentsResponseSchema = z
  .object({
    meta: meta.optional(),
    revenue_by_agent: z.array(z.object({ label: z.string().optional(), amount_ttc: z.number().optional() })).optional(),
  })
  .passthrough();

export const statisticsBillingResponseSchema = z
  .object({
    meta: meta.optional(),
    amounts_series: z
      .object({
        labels: z.array(z.string()),
        amount_ttc: z.array(z.number()),
      })
      .optional(),
    amounts_series_ventes_locations: z
      .object({
        labels: z.array(z.string()),
        ventes_ttc: z.array(z.number()),
        locations_ttc: z.array(z.number()),
      })
      .optional(),
  })
  .passthrough();

export const statisticsOperationsResponseSchema = z
  .object({
    meta: meta.optional(),
    appointments_by_agent: z.array(z.object({ label: z.string().optional(), count: z.number().optional() })).optional(),
    etat_des_lieux: z.object({ labels: z.array(z.string()), values: z.array(z.number()) }).optional(),
  })
  .passthrough();

export const statisticsSummaryResponseSchema = z.object({}).passthrough();

const SCHEMA_BY_SECTION: Record<string, z.ZodType<Record<string, unknown>>> = {
  summary: statisticsSummaryResponseSchema,
  biens: statisticsBiensResponseSchema,
  offers: statisticsOffersResponseSchema,
  clients: statisticsClientsResponseSchema,
  demands: statisticsDemandsResponseSchema,
  agents: statisticsAgentsResponseSchema,
  billing: statisticsBillingResponseSchema,
  operations: statisticsOperationsResponseSchema,
};

export function getStatisticsResponseSchema(section: string): z.ZodType<Record<string, unknown>> {
  return SCHEMA_BY_SECTION[section] ?? z.record(z.string(), z.unknown());
}

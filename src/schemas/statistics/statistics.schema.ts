import { z } from "zod";

export const statisticsFiltersSchema = z.object({
  date_from: z.string(),
  date_to: z.string(),
  granularity: z.enum(["day", "week", "month", "quarter", "year"]).default("month"),
  agent_ids: z.array(z.string()).optional(),
  bien_type_ids: z.array(z.string()).optional(),
  bien_status_ids: z.array(z.string()).optional(),
  wilaya_ids: z.array(z.string()).optional(),
  commune_ids: z.array(z.string()).optional(),
  offer_status_ids: z.array(z.string()).optional(),
  demand_status_ids: z.array(z.string()).optional(),
  payment_status_ids: z.array(z.string()).optional(),
  client_source_ids: z.array(z.string()).optional(),
  demand_source_ids: z.array(z.string()).optional(),
  exclusivity: z.boolean().optional(),
  breakdown: z.enum(["agent", "bien_type", "wilaya", "source", "status"]).optional(),
});

export type StatisticsFilters = z.infer<typeof statisticsFiltersSchema>;

export const statisticsSectionSchema = z.enum([
  "summary",
  "biens",
  "offers",
  "clients",
  "demands",
  "agents",
  "billing",
  "operations",
]);

export type StatisticsSection = z.infer<typeof statisticsSectionSchema>;

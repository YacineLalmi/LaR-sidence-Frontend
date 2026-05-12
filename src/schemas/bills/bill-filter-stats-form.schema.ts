import z from "zod";

export const BillingFilterStatsFormSchema = z.object({
  period: z.enum(["year", "month", "week"]).optional(),
  bien_type_id: z.string().optional(),
  commune_id: z.string().optional(),
  wilaya_id: z.string().optional(),
});

export type BillingFilterStatsForm = z.infer<typeof BillingFilterStatsFormSchema>;

import z from "zod";

export const BienFilterFormStatsSchema = z.object({
  period: z.enum(["year", "month", "week"]).optional(),
  bien_type_id: z.string().optional(),
  wilaya_id: z.string().optional(),
  commune_id: z.string().optional(),
  exclusivity: z.string().optional(),
});

export type BienFilterFormStats = z.infer<typeof BienFilterFormStatsSchema>;

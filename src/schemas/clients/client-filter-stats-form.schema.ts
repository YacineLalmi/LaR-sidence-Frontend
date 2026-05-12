import z from "zod";

export const ClientFilterStatsFormSchema = z.object({
  civility: z.enum(["mr", "mrs", "company"]).optional(),
  period: z.enum(["year", "month", "week"]).optional(),
  bien_type_id: z.string().optional(),
  commune_id: z.string().optional(),
  wilaya_id: z.string().optional(),
});

export type ClientFilterStatsForm = z.infer<typeof ClientFilterStatsFormSchema>;

import z from "zod";

export const ClientFilterStatsFormSchema = z.object({
  civility: z.enum(["mr", "mrs", "company"]).optional(),
  period: z.enum(["year", "month", "week"]).optional(),
});

export type ClientFilterStatsForm = z.infer<typeof ClientFilterStatsFormSchema>;

import z from "zod";

export const CommuneFormSchema = z.object({
  name: z.string().trim().min(1).max(100),
  post_code: z.number(),
  wilaya_id: z.string(),
});

export type CommuneForm = z.infer<typeof CommuneFormSchema>;

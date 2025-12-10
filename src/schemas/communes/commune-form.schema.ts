import z from "zod";

export const CommuneFormSchema = z.object({
  name: z.string().trim().min(1).max(100),
  longitude: z.number().nullable(),
  latitude: z.number().nullable(),
  post_code: z.string(),
  wilaya_id: z.string(),
});

export type CommuneForm = z.infer<typeof CommuneFormSchema>;

import z from "zod";

export const VisitSchema = z.object({
  id: z.number(),
  status: z.string(),
  comment: z.string().nullable(),
  agent: z.string(),
  offer_id: z.number(),
  bien: z.string(),
  created_at: z.iso.datetime(),
  updated_at: z.iso.datetime().nullable(),
  deleted_at: z.iso.datetime().nullable(),
});

export type Visit = z.infer<typeof VisitSchema>;

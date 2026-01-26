import z from "zod";

export const InteractionSchema = z.object({
  id: z.number(),
  type: z.string(),
  comment: z.string().nullable(),
  user: z.string(),
  client: z.string(),
  created_at: z.iso.datetime(),
  updated_at: z.iso.datetime().nullable(),
  deleted_at: z.iso.datetime().nullable(),
});

export type Interaction = z.infer<typeof InteractionSchema>;

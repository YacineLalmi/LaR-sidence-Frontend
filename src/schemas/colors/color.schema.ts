import z from "zod";

export const ColorSchema = z.object({
  id: z.number(),
  code: z.string().max(6),
  name: z.string().max(50),
  description: z.string().max(255).nullable(),
  created_at: z.iso.datetime(),
  updated_at: z.iso.datetime().nullable(),
  deleted_at: z.iso.datetime().nullable(),
});

export type Color = z.infer<typeof ColorSchema>;

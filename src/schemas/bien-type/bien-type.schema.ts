import z from "zod";

export const BienTypeSchema = z.object({
  id: z.number(),
  code: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  is_active: z.union([z.boolean(), z.number()]).transform((val) => {
    if (typeof val === 'number') return val === 1;
    return val;
  }),
  created_at: z.union([z.string(), z.iso.datetime()]).nullable().optional(),
  updated_at: z.union([z.string(), z.iso.datetime()]).nullable().optional(),
  deleted_at: z.union([z.string(), z.iso.datetime()]).nullable().optional(),
});

export type BienType = z.infer<typeof BienTypeSchema>;

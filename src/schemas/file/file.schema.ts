import z from "zod";

export const FileSchema = z.object({
  id: z.number(),
  original_name: z.string(),
  name: z.string(),
  path: z.string().nullable(),
  type: z.string(),
  category: z.string(),
  size: z.number(),
  mime_type: z.string(),
  created_at: z.iso.datetime(),
  updated_at: z.iso.datetime().nullable(),
  deleted_at: z.iso.datetime().nullable(),
});

export type File = z.infer<typeof FileSchema>;

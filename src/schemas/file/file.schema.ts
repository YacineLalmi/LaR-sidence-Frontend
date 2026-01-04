import z from "zod";

export const FileSchema = z.object({
  id: z.string(),
  original_name: z.string(),
  name: z.string(),
  path: z.string(),
  type: z.string(),
  category: z.string(),
  mime_type: z.string(),
  size: z.number(),
  created_at: z.iso.datetime(),
  updated_at: z.iso.datetime().nullable(),
  deleted_at: z.iso.datetime().nullable(),
});

export type File = z.infer<typeof FileSchema>;

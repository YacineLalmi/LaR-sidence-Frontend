import { z } from "zod";

export const LibraryFileUploaderSchema = z
  .object({
    id: z.union([z.string(), z.number()]),
    first_name: z.string().optional(),
    last_name: z.string().optional(),
    email: z.string().optional(),
  })
  .nullable()
  .optional();

export const LibraryFileSchema = z.object({
  /** API may return numeric ids (bigint) or string ids depending on DB. */
  id: z.union([z.string(), z.number()]),
  original_name: z.string(),
  display_name: z.string().nullable().optional(),
  name: z.string(),
  path: z.string().optional(),
  type: z.string(),
  category: z.string().optional(),
  size: z.number(),
  mime_type: z.string(),
  confidential: z.boolean().optional(),
  source: z.string().optional(),
  folder_id: z.union([z.number(), z.string()]).nullable().optional(),
  fileable_type: z.string().nullable().optional(),
  fileable_id: z.union([z.number(), z.string()]).nullable().optional(),
  fileable_label: z.string().nullable().optional(),
  uploader: LibraryFileUploaderSchema,
  folder: z
    .object({
      id: z.union([z.number(), z.string()]),
      name: z.string(),
    })
    .nullable()
    .optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

export type LibraryFile = z.infer<typeof LibraryFileSchema>;

export const LibraryFolderSchema = z
  .object({
    id: z.union([z.number(), z.string()]),
    name: z.string(),
    color_id: z.union([z.number(), z.string()]).nullable().optional(),
    parent_id: z.union([z.number(), z.string()]).nullable().optional(),
    files_count: z.number().optional(),
    files_total_size: z.number().optional(),
  })
  .passthrough();

export type LibraryFolder = z.infer<typeof LibraryFolderSchema>;

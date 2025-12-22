import z from "zod";

export const FileBlobSchema = z.object({
  name: z.string(),
  type: z.string(),
  size: z.number(),
  blob: z.string().regex(/^[A-Za-z0-9+/]+={0,2}$/, "Invalid Base64 encoding"),
});
export type FileBlob = z.infer<typeof FileBlobSchema>;

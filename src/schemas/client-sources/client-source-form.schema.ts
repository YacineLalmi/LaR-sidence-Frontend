import z from "zod";

export const ClientSourceFormSchema = z.object({
  name: z.string().max(100),
  description: z.string().max(255).nullable(),
  is_active: z.boolean(),
});

export type ClientSourceForm = z.infer<typeof ClientSourceFormSchema>;

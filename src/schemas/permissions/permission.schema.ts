import z from "zod";

export const PermissionSchema = z.object({
  id: z.number(),
  name: z.string(),
  display_name: z.string(),
  description: z.string(),
  category: z.string(),
  created_at: z.iso.datetime(),
  updated_at: z.iso.datetime().nullable(),
});

export type Permission = z.infer<typeof PermissionSchema>;

import z from "zod";

export const PermissionSchema = z.object({
  id: z.number(),
  display_name: z.string(),
});

export type Permission = z.infer<typeof PermissionSchema>;

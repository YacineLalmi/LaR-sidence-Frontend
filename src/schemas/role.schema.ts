import z from "zod";

export const RoleFormSchema = z.object({
  id: z.number().optional(),
  name: z.string(),
  display_name: z.string(),
  description: z.string(),
  permissions: z.array(z.number()).optional(),
});

export type RoleForm = z.infer<typeof RoleFormSchema>;

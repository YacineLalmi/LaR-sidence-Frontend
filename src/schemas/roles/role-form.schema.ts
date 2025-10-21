import z from "zod";

export const RoleFormSchema = z.object({
  name: z.string(),
  display_name: z.string(),
  description: z.string(),
  permissions: z.array(z.number()),
});

export type RoleForm = z.infer<typeof RoleFormSchema>;

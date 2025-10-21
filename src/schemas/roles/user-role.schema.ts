import z from "zod";

export const UserRoleSchema = z.object({
  id: z.string(),
  name: z.string(),
  display_name: z.string(),
});

import z from "zod";

export const UserFilterFormSchema = z.object({
  role_id: z.string().optional(),
  is_active: z.string().optional(),
  created_between: z
    .object({
      from: z.date().optional(),
      to: z.date().optional(),
    })
    .optional(),
});

export type UserFilterForm = z.infer<typeof UserFilterFormSchema>;

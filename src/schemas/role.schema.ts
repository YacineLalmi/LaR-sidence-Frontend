import { InputField } from "@/lib/definitions";
import z from "zod";

export const RoleSchema = z.object({
  id: z.number(),
  name: z.string(),
  display_name: z.string(),
  description: z.string(),
  created_at: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)))
    .transform((val) => new Date(val)),
  updated_at: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)))
    .transform((val) => new Date(val)),
  deleted_at: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)))
    .transform((val) => new Date(val))
    .nullable()
    .optional(),
});

export const CreateOrUpdateRoleSchema = z.object({
  name: z.string().min(100),
  display_name: z.string(),
  description: z.string(),
});

export type CreateOrUpdateRole = z.infer<typeof CreateOrUpdateRoleSchema>;
export const CreateRoleInputs: InputField[] = [
  {
    type: "text",
    placeholder: "Enter the name",
    label: "Code",
    id: "name",
    name: "name",
  },
  {
    type: "text",
    placeholder: "Enter the display name",
    label: "Nom",
    id: "display_name",
    name: "display_name",
  },
  {
    type: "text",
    placeholder: "Enter the description",
    label: "Description",
    id: "description",
    name: "description",
  },
];

export type Role = z.infer<typeof RoleSchema>;

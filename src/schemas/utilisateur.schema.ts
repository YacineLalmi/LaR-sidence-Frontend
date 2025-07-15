import z from "zod";

export const UserSchema = z.object({
  id: z.string(),
  nom: z.string(),
  prenom: z.string(),
  est_active: z.boolean(),
  nom_utilisateur: z.string(),
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

export type User = z.infer<typeof UserSchema>;

export const CreateOrUpdateUserSchema = z.object({
  nom: z.string(),
  prenom: z.string(),
  est_active: z.boolean(),
  nom_utilisateur: z.string().email(),
});

export type CreateOrUpdateUser = z.infer<typeof CreateOrUpdateUserSchema>;

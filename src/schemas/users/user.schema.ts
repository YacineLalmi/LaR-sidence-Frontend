import z from "zod";

/** Dates API Laravel (souvent ISO, parfois sans timezone stricte). */
const apiDateTime = z.union([z.string(), z.null()]).optional();

export const UserSchema = z
  .object({
    id: z.union([z.string(), z.number()]).transform((v) => String(v)),
    last_name: z.string(),
    first_name: z.string(),
    phonenumber: z.union([z.string(), z.null()]).optional(),
    is_active: z.coerce.boolean(),
    username: z.string(),
    email: z.string(),
    /** Présent seulement si `include=roles` ; structure variable (permissions, dates). */
    role: z.any().optional().nullable(),
    /** Forme variable selon ColorResource / traductions — ne pas valider strictement en liste. */
    color: z.any().optional().nullable(),
    color_id: z
      .union([z.string(), z.number(), z.null()])
      .optional()
      .transform((v) => (v == null ? undefined : String(v))),
    role_id: z
      .union([z.string(), z.number(), z.null()])
      .optional()
      .transform((v) => (v == null || v === "" ? "" : String(v))),
    created_at: z.union([z.string(), z.null()]),
    updated_at: apiDateTime,
    deleted_at: apiDateTime,
  })
  .passthrough();

export type User = z.infer<typeof UserSchema>;

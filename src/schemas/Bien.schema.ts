import z from "zod";

export const BienSchema = z.object({
  id: z.string().optional(),
  title: z.string(),
  adresse: z.string(),
  wilaya: z.string(),
  commune: z.string(),
  habitable_surface: z.number(),
  total_surface: z.number(),
  peices: z.number(),
  rooms: z.number(),
  price: z.number(),
  exclusivity: z.boolean(),
  exclusivity_start: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)))
    .transform((val) => new Date(val))
    .nullable()
    .optional(),
  exclusivity_end: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)))
    .transform((val) => new Date(val))
    .nullable()
    .optional(),
  responsible_agent: z.string(),
  created_at: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)))
    .transform((val) => new Date(val))
    .optional(),
  updated_at: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)))
    .transform((val) => new Date(val))
    .optional(),
  deleted_at: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)))
    .transform((val) => new Date(val))
    .nullable()
    .optional(),
});

export type Bien = z.infer<typeof BienSchema>;

export const BienFormSchema = z.object({
  title: z.string(),
  adresse: z.string(),
  wilaya: z.string(),
  commune: z.string(),
  habitable_surface: z.number(),
  total_surface: z.number(),
  peices: z.number(),
  rooms: z.number(),
  price: z.number(),
  exclusivity: z.boolean(),
  exclusivity_start: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)))
    .transform((val) => new Date(val))
    .optional(),
  exclusivity_end: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)))
    .transform((val) => new Date(val))
    .optional(),
  responsible_agent: z.string(),
});

export type BienForm = z.infer<typeof BienFormSchema>;

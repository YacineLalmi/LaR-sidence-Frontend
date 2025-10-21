import z from "zod";

export const BienSchema = z.object({
  id: z.string(),
  title: z.string(),
  adresse: z.string(),
  wilaya: z.string(),
  commune: z.string(),
  peices: z.number().nullable(),
  bien_type: z.string(),
  transaction_type: z.string(),
  status: z.string(),
});

export const DetailedBienSchema = z.object({
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

export const BienFilterFormSchema = z.object({
  status_id: z.string().optional(),
  agent_id: z.string().optional(),
  transaction_type_id: z.string().optional(),
  wilaya_id: z.string().optional(),
  commune_id: z.string().optional(),
  bien_type_id: z.string().optional(),
  total_surface: z.string().optional(),
});

export type BienFilterForm = z.infer<typeof BienFilterFormSchema>;

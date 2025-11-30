import z from "zod";

export const BienSchema = z.object({
  id: z.string().optional(),
  title: z.string().optional(),
  adresse: z.string().optional(),
  wilaya: z.string().optional(),
  commune: z.string().optional(),
  bien_type: z.string().optional(),
  price: z.number().optional(),
  transaction_type: z.string().optional(),
  status: z.string().optional(),
  pieces: z.number().optional(),
  habitable_surface: z.number().optional(),
  total_surface: z.number().optional(),
});

export type Bien = z.infer<typeof BienSchema>;

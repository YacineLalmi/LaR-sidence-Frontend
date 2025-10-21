import z from "zod";

export const BienSchema = z.object({
  id: z.string(),
  title: z.string(),
  adresse: z.string(),
  wilaya: z.string(),
  commune: z.string(),
  bien_type: z.string(),
  price: z.number(),
  transaction_type: z.string(),
  status: z.string(),
});

export type Bien = z.infer<typeof BienSchema>;

import z from "zod";

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

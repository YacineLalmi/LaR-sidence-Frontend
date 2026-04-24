import z from "zod";

export const BillFormSchema = z.object({
  due_date: z.string(),
  client_id: z.string(),
  bien_id: z.string(),
  status_id: z.string(),
  services_description: z.string().nullable(),
  amount_ht: z.string(),
  tax_amount: z.string(),
  total_ttc: z.string(),
  billing_model_id: z.string(),
  payments: z.array(z.string()),
  created_at: z.iso.datetime(),
  updated_at: z.iso.datetime(),
  deleted_at: z.iso.datetime().nullable().optional(),
});

export type BillForm = z.infer<typeof BillFormSchema>;

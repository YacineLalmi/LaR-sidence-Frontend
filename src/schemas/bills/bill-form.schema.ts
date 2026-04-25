import z from "zod";

const MAX_DOCUMENT_SIZE = 5 * 1024 * 1024; // 5MB

export const BillFormSchema = z.object({
  due_date: z.string(),
  client_id: z.string(),
  bien_id: z.string(),
  status_id: z.string(),
  services_description: z.string().nullable(),
  amount_ht: z.string(),
  amount_tva: z.string(),
  amount_ttc: z.string(),
  billing_model_id: z.string(),
  documents: z
    .array(z.instanceof(File))
    .refine((files) => files.every((file) => file.size <= MAX_DOCUMENT_SIZE), "Each file must be 5MB or less"),
});

export type BillForm = z.infer<typeof BillFormSchema>;

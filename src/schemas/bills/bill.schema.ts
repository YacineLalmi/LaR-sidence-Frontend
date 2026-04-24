import z from "zod";
import { ClientSchema } from "../clients/client.schema";
import { BienSchema } from "../biens/bien.schema";
import { ClassificationSchema } from "../classification/classification.schema";
import { BillingModelSchema } from "./models/billing-model.schema";
import { PaymentSchema } from "../payment/payment.schema";

export const BillSchema = z.object({
  id: z.string(),
  due_date: z.string(),
  client: ClientSchema.nullable().optional(),
  bien: BienSchema.nullable().optional(),
  status: ClassificationSchema.nullable().optional(),
  services_description: z.string().nullable(),
  amount_ht: z.string(),
  tax_amount: z.string(),
  total_ttc: z.string(),
  bill_model_id: z.string(),
  payments: z.array(z.string()),
  created_at: z.iso.datetime(),
  updated_at: z.iso.datetime(),
  deleted_at: z.iso.datetime().nullable().optional(),
});

export type Bill = z.infer<typeof BillSchema>;

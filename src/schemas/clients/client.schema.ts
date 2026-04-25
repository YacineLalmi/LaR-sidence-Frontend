import z from "zod";
import { FileSchema } from "../file/file.schema";
import { InteractionSchema } from "../interaction/interaction";
import { ClassificationSchema } from "../classification/classification.schema";

export const ClientSchema = z.object({
  id: z.string(),
  first_name: z.string(),
  last_name: z.string(),
  civility: z.enum(['mr', 'mrs', 'company']),
  email: z.string(),
  mobile: z.string(),
  phone_numbers: z.array(z.string()).optional(),
  type: ClassificationSchema.optional(),
  source: ClassificationSchema.optional(),
  status: ClassificationSchema.optional(),
  comment: z.string().nullable(),
  company_name: z.string().nullable(),
  trade_register: z.string().nullable(),
  tax_identification: z.string().nullable(),
  ai: z.string().nullable(),
  documents: z.array(FileSchema).optional(),
  interactions: z.array(InteractionSchema).optional(),
  created_at: z.iso.datetime(),
  updated_at: z.iso.datetime(),
  deleted_at: z.iso.datetime().nullable(),
});

export type Client = z.infer<typeof ClientSchema>;

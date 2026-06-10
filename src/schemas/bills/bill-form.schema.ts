import z from "zod";
import { FileSchema } from "../file/file.schema";
import { inputFilesValidation } from "../global/file-field.schema";

const MAX_DOCUMENT_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_DOCUMENT_TYPES = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];

export const BillFormSchema = z.object({
  due_date: z.date(),
  client_id: z.string(),
  bien_id: z.string(),
  status_id: z.string(),
  services_description: z.string().nullable(),
  amount_ht: z.string(),
  amount_tva: z.string(),
  amount_ttc: z.string(),
  billing_model_id: z.string(),
  new_documents: inputFilesValidation({ maxSize: MAX_DOCUMENT_SIZE, acceptedTypes: ACCEPTED_DOCUMENT_TYPES }),
  deleted_documents: z.array(z.string()).optional(),
});

export type BillForm = z.infer<typeof BillFormSchema>;

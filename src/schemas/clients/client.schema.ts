import z from "zod";
import { ClientTypeSchema } from "../client-types/client-type.schema";
import { ClientSourceSchema } from "../client-sources/client-source.schema";
import { ClientStatusSchema } from "../client-status/client-status.schema";
import { FileSchema } from "../file/file.schema";
import { InteractionSchema } from "../interaction/interaction";

export const ClientSchema = z.object({
  id: z.number(),
  first_name: z.string(),
  last_name: z.string(),
  civility: z.string(),
  email: z.string().optional(),
  mobile: z.string(),
  phone_numbers: z.array(z.string()),
  type: ClientTypeSchema,
  source: ClientSourceSchema,
  status: ClientStatusSchema,
  comment: z.string().nullable(),
  company_name: z.string().nullable(),
  trade_register: z.string().nullable(),
  tax_identification: z.string().nullable(),
  ai: z.string().nullable(),
  documents: z.array(FileSchema),
  interactions: z.array(InteractionSchema),
  created_at: z.iso.datetime(),
  updated_at: z.iso.datetime().nullable().optional(),
  deleted_at: z.iso.datetime().nullable().optional(),
});

export type Client = z.infer<typeof ClientSchema>;

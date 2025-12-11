import z from "zod";
import { ClientTypeSchema } from "../client-types/client-type.schema";
import { ClientSourceSchema } from "../client-sources/client-source.schema";
import { ClientStatusSchema } from "../client-status/client-status.schema";

export const ClientSchema = z.object({
  id: z.number(),
  first_name: z.string(),
  last_name: z.string(),
  gender: z.string(),
  email: z.string().optional(),
  phone_numbers: z.array(z.string()).optional(),
  type: ClientTypeSchema,
  source: ClientSourceSchema,
  status: ClientStatusSchema,
  comment: z.string().nullable().optional(),
  created_at: z.iso.datetime(),
  updated_at: z.iso.datetime().nullable().optional(),
  deleted_at: z.iso.datetime().nullable().optional(),
});

export type Client = z.infer<typeof ClientSchema>;

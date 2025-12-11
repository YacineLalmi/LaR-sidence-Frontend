import z from "zod";
import { ColorSchema } from "../colors/color.schema";

export const ClientStatusSchema = z.object({
  id: z.number(),
  code: z.string(),
  name: z.string(),
  description: z.string().nullable().optional(),
  color: ColorSchema,
  is_active: z.boolean(),
  created_at: z.iso.datetime(),
  updated_at: z.iso.datetime().nullable().optional(),
  deleted_at: z.iso.datetime().nullable().optional(),
});

export type ClientStatus = z.infer<typeof ClientStatusSchema>;

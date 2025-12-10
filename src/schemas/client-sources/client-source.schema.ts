import z from "zod";
import { ColorSchema } from "../colors/color.schema";

export const ClientSourceSchema = z.object({
  id: z.number(),
  code: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  is_active: z.boolean(),
  created_at: z.iso.datetime(),
  updated_at: z.iso.datetime().nullable(),
  deleted_at: z.iso.datetime().nullable(),
});

export type ClientSource = z.infer<typeof ClientSourceSchema>;

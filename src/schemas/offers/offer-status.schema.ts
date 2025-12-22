import z from "zod";
import { ColorSchema } from "../colors/color.schema";

export const OfferStatusSchema = z.object({
  id: z.number(),
  code: z.string(),
  name: z.string(),
  description: z.string().nullable().optional(),
  is_active: z.boolean(),
  color: ColorSchema,
  created_at: z.iso.datetime(),
  updated_at: z.iso.datetime().nullable().optional(),
  deleted_at: z.iso.datetime().nullable().optional(),
});

export type OfferStatus = z.infer<typeof OfferStatusSchema>;

import z from "zod";
import { ClientSchema } from "../clients/client.schema";
import { OfferStatusSchema } from "./offer-status.schema";
import { OfferTypeSchema } from "./offer-type.schema";

// Simplified Bien schema for offers (BienResources returns simplified structure)
const BienResourcesSchema = z.object({
  id: z.string(),
  title: z.string().nullable().optional(),
  adresse: z.string().nullable().optional(),
  wilaya: z.string().nullable().optional(),
  commune: z.string().nullable().optional(),
  bien_type: z.string().nullable().optional(),
  price: z.union([z.number(), z.string()]).transform((val) => typeof val === 'string' ? parseFloat(val) : val).nullable().optional(),
  transaction_type: z.string().nullable().optional(),
  status: z.string().nullable().optional(),
}).nullable().optional();

export const OfferSchema = z.object({
  id: z.string(),
  bien: BienResourcesSchema,
  client: ClientSchema.nullable().optional(),
  type: OfferTypeSchema.nullable().optional(),
  type_id: z.string().nullable().optional(),
  status: OfferStatusSchema.nullable().optional(),
  status_id: z.string().nullable().optional(),
  proposed_price: z.union([z.number(), z.string()]).transform((val) => typeof val === 'string' ? parseFloat(val) : val),
  conditions: z.string().nullable().optional(),
  comments: z.string().nullable().optional(),
  created_at: z.union([z.string(), z.iso.datetime()]).transform((val) => {
    if (typeof val === 'string') {
      // Try to parse as ISO datetime, if it fails, return as is
      try {
        new Date(val);
        return val;
      } catch {
        return val;
      }
    }
    return val;
  }),
  updated_at: z.union([z.string(), z.iso.datetime()]).nullable().optional(),
  deleted_at: z.union([z.string(), z.iso.datetime()]).nullable().optional(),
});

export type Offer = z.infer<typeof OfferSchema>;
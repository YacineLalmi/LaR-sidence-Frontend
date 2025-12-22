import z from "zod";
import { ClientSchema } from "../clients/client.schema";
import { OfferStatusSchema } from "./offer-status.schema";
import { OfferTypeSchema } from "./offer-type.schema";
import { BienSchema } from "../biens/bien.schema";

export const OfferSchema = z.object({
  id: z.string(),
  bien: BienSchema,
  client: ClientSchema,
  type: OfferTypeSchema,
  status: OfferStatusSchema,
  status_id: z.string().nullable().optional(),
  proposed_price: z.number(),
  conditions: z.string().nullable().optional(),
  comments: z.string().nullable().optional(),
  created_at: z.iso.datetime(),
  updated_at: z.iso.datetime().nullable(),
  deleted_at: z.iso.datetime().nullable(),
});

export type Offer = z.infer<typeof OfferSchema>;

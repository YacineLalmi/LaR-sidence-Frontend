import z from "zod";
import { ClientSchema } from "../clients/client.schema";
import { BienSchema } from "../biens/bien.schema";
import { OfferStatusSchema } from "../offer-status/offer-status.schema";
import { OfferTypeSchema } from "../offer-type/offer-type.schema";
import { VisitSchema } from "../visit/visit.schema";

export const OfferSchema = z.object({
  id: z.number(),
  bien: BienSchema,
  client: ClientSchema,
  type: OfferTypeSchema,
  status: OfferStatusSchema,
  visits: z.array(VisitSchema),
  status_id: z.string().nullable().optional(),
  proposed_price: z.number(),
  conditions: z.string().nullable(),
  comment: z.string().nullable(),
  created_at: z.iso.datetime(),
  updated_at: z.iso.datetime().nullable(),
  deleted_at: z.iso.datetime().nullable(),
});

export type Offer = z.infer<typeof OfferSchema>;

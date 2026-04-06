import z from "zod";
import { ClientSchema } from "../clients/client.schema";
import { BienSchema } from "../biens/bien.schema";
import { VisitSchema } from "../visit/visit.schema";
import { ClassificationSchema } from "../classification/classification.schema";

export const OfferSchema = z.object({
  id: z.string(),
  bien: BienSchema.optional(),
  client: ClientSchema.optional(),
  type: ClassificationSchema.optional(),
  status: ClassificationSchema.optional(),
  visits: z.array(VisitSchema).optional(),
  status_id: z.string().nullable().optional(),
  proposed_price: z.number(),
  conditions: z.string().nullable(),
  comment: z.string().nullable(),
  created_at: z.iso.datetime(),
  updated_at: z.iso.datetime().nullable(),
  deleted_at: z.iso.datetime().nullable(),
});

export type Offer = z.infer<typeof OfferSchema>;

import z from "zod";
import { ClientSchema } from "../clients/client.schema";
import { BienSchema } from "../biens/bien.schema";
import { UserSchema } from "../users/user.schema";
import { ClassificationSchema } from "../classification/classification.schema";

export const DemandSchema = z.object({
  id: z.string(),
  title: z.string().nullable().optional(),
  type: ClassificationSchema.optional(),
  client: ClientSchema.optional(),
  source: ClassificationSchema.optional(),
  bien: BienSchema.optional(),
  agent: UserSchema.optional(),
  status: ClassificationSchema.optional(),
  priority: ClassificationSchema.optional(),
  budget: z.string(),
  comment: z.string().nullable(),
  created_at: z.iso.datetime(),
  updated_at: z.iso.datetime(),
  deleted_at: z.iso.datetime().nullable().optional(),
});

export type Demand = z.infer<typeof DemandSchema>;

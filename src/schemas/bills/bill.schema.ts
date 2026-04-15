import z from "zod";
import { ClientSchema } from "../clients/client.schema";
import { BienSchema } from "../biens/bien.schema";
import { UserSchema } from "../users/user.schema";
import { ClassificationSchema } from "../classification/classification.schema";

export const BillSchema = z.object({
  id: z.string(),
  title: z.string().nullable().optional(),
  type: ClassificationSchema.nullable().optional(),
  client: ClientSchema.nullable().optional(),
  source: ClassificationSchema.optional(),
  bien: BienSchema.nullable().optional(),
  agent: UserSchema.nullable().optional(),
  status: ClassificationSchema.nullable().optional(),
  priority: ClassificationSchema.nullable().optional(),
  budget: z.string(),
  comment: z.string().nullable(),
  created_at: z.iso.datetime(),
  updated_at: z.iso.datetime(),
  deleted_at: z.iso.datetime().nullable().optional(),
});

export type Bill = z.infer<typeof BillSchema>;

import z from "zod";
import { ClientSchema } from "../clients/client.schema";
import { ClientTypeSchema } from "../client-types/client-type.schema";
import { ClientSourceSchema } from "../client-sources/client-source.schema";
import { BienSchema } from "../biens/bien.schema";
import { UserSchema } from "../users/user.schema";
import { ClientStatusSchema } from "../client-status/client-status.schema";
import { BienPrioritySchema } from "../bien-priority/bien-priotiry.schema";

export const DemandSchema = z.object({
  id: z.number(),
  title: z.string().nullable().optional(),
  type: ClientTypeSchema,
  client: ClientSchema,
  source: ClientSourceSchema,
  bien: BienSchema,
  agent: UserSchema,
  status: ClientStatusSchema,
  priority: BienPrioritySchema,
  budget: z.string(),
  comment: z.string().nullable(),
  created_at: z.iso.datetime(),
  updated_at: z.iso.datetime().nullable().optional(),
  deleted_at: z.iso.datetime().nullable().optional(),
});

export type Demand = z.infer<typeof DemandSchema>;

import z from "zod";
import { ClientSchema } from "../clients/client.schema";
import { BienSchema } from "../biens/bien.schema";
import { UserSchema } from "../users/user.schema";
import { ClassificationSchema } from "../classification/classification.schema";

export const EventSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().nullable(),
  start_date: z.string(),
  end_date: z.string(),
  type: ClassificationSchema.optional(),
  agent: UserSchema.optional(),
  bien: BienSchema.nullable().optional(),
  client: ClientSchema.optional(),
  created_at: z.iso.datetime(),
  updated_at: z.iso.datetime(),
  deleted_at: z.iso.datetime().nullable(),
});

export type Event = z.infer<typeof EventSchema>;

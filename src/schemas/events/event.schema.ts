import z from "zod";
import { ClientSchema } from "../clients/client.schema";
import { BienSchema } from "../biens/bien.schema";
import { UserSchema } from "../users/user.schema";
import { EventTypeSchema } from "../event-types/event-type.schema";

export const EventSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string().nullable(),
  start_date: z.string(),
  end_date: z.string(),
  type: EventTypeSchema,
  agent: UserSchema,
  bien: BienSchema,
  client: ClientSchema,
  created_at: z.iso.datetime(),
  updated_at: z.iso.datetime().nullable(),
  deleted_at: z.iso.datetime().nullable(),
});

export type Event = z.infer<typeof EventSchema>;

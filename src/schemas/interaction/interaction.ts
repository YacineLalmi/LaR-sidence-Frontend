import z from "zod";
import { UserSchema } from "../users/user.schema";
import { ClientSchema } from "../clients/client.schema";

export const InteractionSchema = z.object({
  id: z.string(),
  type: z.string(),
  comment: z.string().nullable(),
  user: UserSchema.optional(),
  client_id: z.string(),
  created_at: z.iso.datetime(),
  updated_at: z.iso.datetime(),
  deleted_at: z.iso.datetime().nullable(),
});

export type Interaction = z.infer<typeof InteractionSchema>;

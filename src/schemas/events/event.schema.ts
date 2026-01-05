import z from "zod";
import { EventTypeSchema } from "./event-type.schema";
import { ListItemSchema } from "../global.schema";

export const EventSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().nullable().optional(),
  start_date: z.union([z.string(), z.date()]).transform((val) => (typeof val === "string" ? new Date(val) : val)),
  end_date: z.union([z.string(), z.date()]).transform((val) => (typeof val === "string" ? new Date(val) : val)),
  type_id: z.string().nullable().optional(),
  type: EventTypeSchema.nullable().optional(),
  agent_id: z.string().nullable().optional(),
  agent: ListItemSchema.nullable().optional(),
  bien_id: z.string().nullable().optional(),
  bien: ListItemSchema.nullable().optional(),
  client_id: z.string().nullable().optional(),
  client: ListItemSchema.nullable().optional(),
  created_at: z.union([z.string(), z.date()]).optional().nullable(),
  updated_at: z.union([z.string(), z.date()]).optional().nullable(),
  deleted_at: z.union([z.string(), z.date()]).optional().nullable(),
});

export type Event = z.infer<typeof EventSchema>;





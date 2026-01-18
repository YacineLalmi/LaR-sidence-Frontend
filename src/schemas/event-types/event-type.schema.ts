import z from "zod";
import { ColorSchema } from "../colors/color.schema";

export const EventTypeSchema = z.object({
  id: z.number(),
  code: z.string(),
  name: z.string(),
  is_active: z.boolean(),
  color: ColorSchema,
  description: z.string().nullable(),
  created_at: z.iso.datetime(),
  updated_at: z.iso.datetime().nullable(),
  deleted_at: z.iso.datetime().nullable(),
});

export type EventType = z.infer<typeof EventTypeSchema>;

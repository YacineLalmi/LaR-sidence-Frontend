import z from "zod";

export const EventTypeSchema = z.object({
  id: z.string(),
  name: z.string(),
  color: z.string().nullable().optional(),
});

export type EventType = z.infer<typeof EventTypeSchema>;





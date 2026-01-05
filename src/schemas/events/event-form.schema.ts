import z from "zod";

export const EventFormSchema = z.object({
  title: z.string().min(1, "Le titre est obligatoire"),
  description: z.string().min(1, "La description est obligatoire"),
  start_date: z.date(),
  end_date: z.date(),
  type_id: z.string().min(1, "Le type d'événement est obligatoire"),
  agent_id: z.string().min(1, "L'agent est obligatoire"),
  bien_id: z.string().min(1, "Le bien est obligatoire"),
  client_id: z.string().min(1, "Le client est obligatoire"),
});

export type EventForm = z.infer<typeof EventFormSchema>;





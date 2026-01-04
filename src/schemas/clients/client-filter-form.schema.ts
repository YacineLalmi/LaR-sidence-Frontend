import z from "zod";

export const ClientFilterFormSchema = z.object({
  civility: z.string().optional(),
  status_id: z.string().optional(),
  type_id: z.string().optional(),
  source_id: z.string().optional(),
});

export type ClientFilterForm = z.infer<typeof ClientFilterFormSchema>;

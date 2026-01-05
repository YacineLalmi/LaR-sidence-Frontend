import z from "zod";

export const DemandFormSchema = z.object({
  title: z.string().min(1, "Le titre est requis").max(255),
  type_id: z.string().min(1, "Le type de demande est requis"),
  client_id: z.string().min(1, "Le client est requis"),
  source_id: z.string().min(1, "La source est requise"),
  bien_id: z.string().min(1, "Le bien est requis"),
  agent_id: z.string().min(1, "L'agent est requis"),
  status_id: z.string().min(1, "Le statut est requis"),
  priority_id: z.string().min(1, "La priorité est requise"),
  budget: z.union([z.number(), z.string()]).transform((val) => {
    if (typeof val === 'string') {
      const num = parseFloat(val.replace(/[^\d.-]/g, ''));
      return isNaN(num) ? 0 : num;
    }
    return val;
  }).nullable().optional(),
  comment: z.string().nullable().optional(),
});

export type DemandForm = z.infer<typeof DemandFormSchema>;


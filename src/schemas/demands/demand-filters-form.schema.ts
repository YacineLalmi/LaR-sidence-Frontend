import z from "zod";

export const DemandFilterFormSchema = z.object({
  status_id: z.string().optional(),
  type_id: z.string().optional(),
  client_id: z.string().optional(),
  agent_id: z.string().optional(),
  budget_between: z
    .object({
      from: z.string().optional(),
      to: z.string().optional(),
    })
    .optional(),
  created_between: z
    .object({
      from: z.date().optional(),
      to: z.date().optional(),
    })
    .optional(),
});

export type DemandFilterForm = z.infer<typeof DemandFilterFormSchema>;

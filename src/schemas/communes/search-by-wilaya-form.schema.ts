import z from "zod";

export const SearchByWilayaFormSchema = z.object({
  wilaya_id: z.string(),
});

export type SearchByWilayaForm = z.infer<typeof SearchByWilayaFormSchema>;

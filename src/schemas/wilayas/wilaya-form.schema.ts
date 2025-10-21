import z from "zod";

export const WilayaFormSchema = z.object({
  code: z.string(),
  name: z.string(),
});

export type WilayaForm = z.infer<typeof WilayaFormSchema>;

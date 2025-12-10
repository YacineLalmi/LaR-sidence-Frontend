import z from "zod";

export const WilayaFormSchema = z.object({
  name: z.string().trim().min(1).max(100),
  code: z.string().regex(/^\d{1,3}$/, "code must be an integer with up to 3 digits"),
  longitude: z.number().nullable().optional(),
  latitude: z.number().nullable().optional(),
});

export type WilayaForm = z.infer<typeof WilayaFormSchema>;

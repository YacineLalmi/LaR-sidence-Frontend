import z from "zod";

export const ColorFormSchema = z.object({
  code: z
    .string()
    .regex(/^#([0-9A-F]{3}|[0-9A-F]{6})$/i)
    .transform((val) => (val.startsWith("#") ? val.substring(1) : val)),
  name: z.string().max(50),
  description: z.string().max(255).nullable(),
});

export type ColorForm = z.infer<typeof ColorFormSchema>;

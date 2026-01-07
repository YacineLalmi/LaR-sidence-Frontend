import z from "zod";

export const ColorFormSchema = z.object({
  background_color: z.string().regex(/^#?([A-Fa-f0-9]{6})$/),
  text_color: z.string().regex(/^#?([A-Fa-f0-9]{6})$/),
  name: z.string().max(50),
  description: z.string().max(255).nullable(),
});

export type ColorForm = z.infer<typeof ColorFormSchema>;

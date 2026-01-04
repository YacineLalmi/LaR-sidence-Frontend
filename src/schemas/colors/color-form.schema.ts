import z from "zod";

export const ColorFormSchema = z.object({
  code: z.string().regex(/^#?([A-F0-9]{6}|[A-F0-9]{3})$/),
  textColor: z.string().regex(/^#?([A-F0-9]{6}|[A-F0-9]{3})$/),
  name: z.string().max(50),
  description: z.string().max(255).nullable(),
});

export type ColorForm = z.infer<typeof ColorFormSchema>;

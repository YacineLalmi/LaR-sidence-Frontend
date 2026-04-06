import z from "zod";

export const TranslationSchema = z.object({
    fr: z.string(),
    en: z.string(),
    ar: z.string(),
})

export type Translation = z.infer<typeof TranslationSchema>
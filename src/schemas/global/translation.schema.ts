import z from "zod";

export const TranslationSchema = z.object({
    fr: z.string().nullable(),
    en: z.string().nullable(),
    ar: z.string().nullable(),
})

export type Translation = z.infer<typeof TranslationSchema>
import z from "zod";

export const TranslationFormSchema = z.object({
    fr: z.string()
        .trim()
        .min(1, "Ce champ est requis (FR)")
        .max(100, "Maximum 100 caractères (FR)"),
    en: z.string()
        .trim()
        .min(1, "This field is required (EN)")
        .max(100, "Maximum 100 characters (EN)"),
    ar: z.string()
        .trim()
        .min(1, "هذا الحقل مطلوب (AR)")
        .max(100, "الحد الأقصى 100 حرف (AR)"),
});

export type TranslationForm = z.infer<typeof TranslationFormSchema>
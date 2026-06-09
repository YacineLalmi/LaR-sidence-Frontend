import z from "zod";
import { TranslationSchema } from "../global/translation.schema";

export const ClassificationFormSchema = z.object({
    code: z.string().optional(),
    name: TranslationSchema,
    description: TranslationSchema.optional(),
    is_active: z.boolean(),
    color_id: z.string().nullable(),
})

export type ClassificationForm = z.infer<typeof ClassificationFormSchema>;
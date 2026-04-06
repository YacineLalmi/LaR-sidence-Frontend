import z from "zod";
import { TranslationSchema } from "../global/translation.schema";
import { ColorSchema } from "../colors/color.schema";

export const ClassificationSchema = z.object({
    id: z.string(),
    code: z.string(),
    category: z.string().optional(),
    scope: z.string().optional(),
    is_active: z.boolean(),
    name: TranslationSchema,
    description: TranslationSchema,
    color: ColorSchema.nullable().optional(),
    color_id: z.string(),
    created_at: z.iso.datetime(),
    updated_at: z.iso.datetime(),
    deleted_at: z.iso.datetime().nullable()
})

export type Classification = z.infer<typeof ClassificationSchema>;
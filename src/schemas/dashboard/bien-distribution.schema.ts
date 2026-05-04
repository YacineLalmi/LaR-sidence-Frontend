import z from "zod";
import { TranslationSchema } from "../global/translation.schema";

export const BienDistributionSchema = z.object({
    label: TranslationSchema,
    value: z.number()
})

export type BienDistribution = z.infer<typeof BienDistributionSchema>
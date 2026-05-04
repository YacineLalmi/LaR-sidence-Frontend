import z from "zod";

export const TransactionSchema = z.object({
    label: z.string(),
    ventes: z.number(),
    locations: z.number()
})

export type Transaction = z.infer<typeof TransactionSchema>
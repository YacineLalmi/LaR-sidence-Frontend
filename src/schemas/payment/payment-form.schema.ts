import z from "zod";

export const PaymentFormSchema = z.object({
    amount: z.string(),
    reference: z.string(),
    comment: z.string(),
})

export type PaymentForm = z.infer<typeof PaymentFormSchema>
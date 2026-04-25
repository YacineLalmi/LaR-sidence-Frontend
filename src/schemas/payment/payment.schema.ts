import z from "zod";

export const PaymentSchema = z.object({
    id: z.string(),
    amount: z.string(),
    payment_date: z.string(),
    reference: z.string().nullable().optional(),
    comment: z.string().nullable().optional(),
    created_at: z.iso.datetime(),
    updated_at: z.iso.datetime(),
    deleted_at: z.iso.datetime().nullable().optional(),
})

export type Payment = z.infer<typeof PaymentSchema>
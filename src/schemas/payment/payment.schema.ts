import z from "zod";
import { BillSchema } from "../bills/bill.schema";

export const PaymentSchema = z.object({
    id: z.string(),
    amount: z.string(),
    payment_date: z.string(),
    reference: z.string(),
    comment: z.string(),
    bill: z.array(BillSchema).optional(),
    created_at: z.iso.datetime(),
    updated_at: z.iso.datetime(),
    deleted_at: z.iso.datetime().nullable(),
})
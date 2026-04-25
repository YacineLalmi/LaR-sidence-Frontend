import z from "zod";
import { BillSchema } from "../bill.schema";
import { MediaSchema } from "@/schemas/global/media.schema";

export const BillingModelSchema = z.object({
    id: z.string(),
    name: z.string(),
    iban: z.string(),
    swift_bic: z.string(),
    bank_name: z.string(),
    logo: MediaSchema.nullable().optional(),
    tax_rate: z.number(),
    legal_mentions: z.string(),
    footer: z.string(),
    created_at: z.iso.datetime(),
    updated_at: z.iso.datetime(),
    deleted_at: z.iso.datetime().nullable().optional(),
});

export type BillingModel = z.infer<typeof BillingModelSchema>;
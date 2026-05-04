import z from "zod";
import { TransactionSchema } from "./transaction.schema";

export const ChartStatsSchema = z.object({
    max: z.number(),
    data: z.array(TransactionSchema),
})

export type ChartStats = z.infer<typeof ChartStatsSchema>
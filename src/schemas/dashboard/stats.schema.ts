import z from "zod";

export const statsSchema = z.object({
    all_time_count: z.number(),
    current_month_count: z.number(),
    previous_month_count: z.number(),
    change_percent: z.number(),
    trend: z.enum(["up", "down"])
})

export type Stats = z.infer<typeof statsSchema>
import z from "zod";

export const BienDetailsSchema = z.object({});

export type BienDetails = z.infer<typeof BienDetailsSchema>;

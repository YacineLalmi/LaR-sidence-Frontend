import z from "zod";

export const OfferFormSchema = z.object({
  first_name: z.string().max(50),
  last_name: z.string().max(50),
  gender: z
    .string()
    .max(1)
    .refine((val) => ["M", "F"].includes(val)),
  email: z.email(),
  phone_numbers: z.array(
    z.object({
      countryCode: z.string(),
      phoneNumber: z.string(),
    })
  ),
  test: z.array(z.string()).min(1).optional(),
  commentaire: z.string(),
  type_id: z.string(),
  status_id: z.string(),
  source_id: z.string(),
  documents: z
    .array(
      z.object({
        file: z.instanceof(File),
        name: z.string(),
      })
    )
    .optional(),
});

export type OfferForm = z.infer<typeof OfferFormSchema>;

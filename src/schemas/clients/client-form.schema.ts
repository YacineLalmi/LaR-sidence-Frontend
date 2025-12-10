import z from "zod";

export const ClientFormSchema = z.object({
  first_name: z.string().max(50),
  last_name: z.string().max(50),
  gender: z.string(),
  email: z.email(),
  phone_numbers: z.array(
    z.object({
      countryCode: z.string(),
      phoneNumber: z.string(),
    })
  ),
  test: z.array(z.string()).min(1).optional(),
  comment: z.string().nullable(),
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

export type ClientForm = z.infer<typeof ClientFormSchema>;

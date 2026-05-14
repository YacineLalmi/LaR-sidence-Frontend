import z from "zod";

const MAX_DOCUMENT_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_DOCUMENT_TYPES = ["application/pdf"];

export const ClientFormSchema = z.object({
  first_name: z.string().max(50),
  last_name: z.string().max(50),
  civility: z.enum(["mr", "mrs", "company"]),
  email: z.string()
    .trim()
    .transform((v) => (v === "" ? null : v))
    .nullable()
    .refine(
      (email) => email === null || z.string().email().safeParse(email).success,
      {
        message: "Invalid email",
      }
    ),
  mobile: z.string(),
  phone_numbers: z.array(z.string().regex(/^\d{12}$/, { message: "Le format du numéro de téléphone est incorrect" })),
  test: z.array(z.string()).min(1).optional(),
  comment: z.string().nullable(),
  company_name: z.string().nullable(),
  trade_register: z.string().nullable(),
  tax_identification: z.string().nullable(),
  ai: z.string().nullable(),
  type_id: z.string(),
  status_id: z.string(),
  source_id: z.string(),
  documents: z
    .array(z.instanceof(File))
    .refine((files) => files.every((file) => file.size <= MAX_DOCUMENT_SIZE), "Each file must be 5MB or less"),
});

export type ClientForm = z.infer<typeof ClientFormSchema>;

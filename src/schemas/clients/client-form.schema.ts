import z from "zod";

const MAX_DOCUMENT_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_DOCUMENT_TYPES = ["application/pdf"];

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
    .array(z.instanceof(File))
    .min(1, "At least one file is required")
    .max(5, "You can upload up to 5 files")
    .refine((files) => files.every((file) => file.size <= MAX_DOCUMENT_SIZE), "Each file must be 5MB or less")
    .refine(
      (files) => files.every((file) => ACCEPTED_DOCUMENT_TYPES.includes(file.type)),
      "Only PDF files are allowed"
    ),
});

export type ClientForm = z.infer<typeof ClientFormSchema>;

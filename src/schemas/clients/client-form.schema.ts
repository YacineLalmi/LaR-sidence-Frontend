import { REGEX } from "@/constants/regex";
import z from "zod";

const MAX_DOCUMENT_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_DOCUMENT_TYPES = [
  "image/png",
  "image/jpeg",
  "image/jpg",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
];

export const ClientFormSchema = z.object({
  civility: z.enum(["mr", "mrs", "company"]),

  first_name: z.string().max(50).trim().nullable(),
  last_name: z.string().max(50).trim().nullable(),

  email: z.string()
    .trim()
    .transform((v) => (v === "" ? null : v))
    .nullable()
    .refine(
      (email) => email === null || z.email().safeParse(email).success,
      { message: "Invalid email format" }
    ),

  mobile: z.string().regex(REGEX.PHONE_NUMBER, { message: "Le format du numéro de téléphone est incorrect" }).max(13),

  phone_numbers: z.array(
    z.string().regex(REGEX.PHONE_NUMBER, { message: "Le format du numéro de téléphone est incorrect" })
  ),

  comment: z.string()
    .trim()
    .transform((v) => (v === "" ? null : v))
    .nullable(),

  // Company info fields
  company_name: z.string().max(255).trim().nullable(),
  trade_register: z.string().max(255).trim().nullable(),
  tax_identification: z.string().max(255).trim().nullable(),
  ai: z.string().max(255).trim().nullable(),

  // Classifications matching the backend database configuration IDs
  type_id: z.union([z.string(), z.number()]),
  status_id: z.union([z.string(), z.number()]),
  source_id: z.union([z.string(), z.number()]),

  // Optimized Media Strategy:
  // This allows the array to hold either new native Files OR metadata objects of files already saved.
  new_documents: z
    .array(z.instanceof(File))
    .refine(
      (files) => files.every((file) => !(file instanceof File) || file.size <= MAX_DOCUMENT_SIZE),
      "Each file must be 5MB or less"
    )
    .refine(
      (files) => files.every((file) => !(file instanceof File) || ACCEPTED_DOCUMENT_TYPES.includes(file.type)),
      "Invalid file format (.png, .jpg, .pdf, .doc, .docx only)"
    ),

  // Array storing IDs of already existing server files slated for deletion
  deleted_documents: z.array(z.union([z.string(), z.number()])),
})
// Enforce Laravel's 'required_if' logic on the client side
// .superRefine((data, ctx) => {
//   if (data.civility === "mr" || data.civility === "mrs") {
//     if (!data.first_name || data.first_name.trim() === "") {
//       ctx.addIssue({ code: z.ZodIssueCode.custom, message: "First name is required", path: ["first_name"] });
//     }
//     if (!data.last_name || data.last_name.trim() === "") {
//       ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Last name is required", path: ["last_name"] });
//     }
//   }

//   if (data.civility === "company") {
//     const companyFields: Array<keyof typeof data> = ["company_name", "trade_register", "tax_identification", "ai"];
//     companyFields.forEach((field) => {
//       const val = data[field];
//       if (!val || (typeof val === "string" && val.trim() === "")) {
//         ctx.addIssue({ code: z.ZodIssueCode.custom, message: "This company field is required", path: [field] });
//       }
//     });
//   }
// });

export type ClientForm = z.infer<typeof ClientFormSchema>;
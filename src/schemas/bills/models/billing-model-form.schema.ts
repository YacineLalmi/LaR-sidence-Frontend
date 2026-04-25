import { z } from "zod";

const MAX_FILE_SIZE = 2048 * 1024; // 2MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/svg+xml"];

export const BillingModelFormSchema = z.object({
    name: z.string()
        .min(1, "Name is required")
        .max(255, "Name must be less than 255 characters"),

    iban: z.string()
        .min(11, "IBAN is required")
        .max(34, "IBAN is too long")
        .transform((val) => val.replace(/\s+/g, "").toUpperCase())
        .refine((val) => /^[A-Z]{2}\d{2}[A-Z0-9]{11,30}$/.test(val), {
            message: "Invalid IBAN format",
        }),

    swift_bic: z.string()
        .min(1, "SWIFT/BIC is required")
        .toUpperCase()
        .refine((val) => /^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/.test(val), {
            message: "Invalid SWIFT/BIC format (8 or 11 characters required)",
        }),

    bank_name: z.string()
        .min(1, "Bank name is required")
        .max(255),

    // Handling the logo (File object for browser uploads)
    logo: z.any()
        .refine((file) => file instanceof File || file === undefined || file === null, "Invalid file")
        .refine((file) => !file || file.size <= MAX_FILE_SIZE, "Max image size is 2MB")
        .refine(
            (file) => !file || ACCEPTED_IMAGE_TYPES.includes(file.type),
            "Only .jpg, .jpeg, .png, .webp and .svg formats are supported"
        )
        .optional(),

    tax_rate: z.string()
        .min(0, "Tax rate cannot be negative")
        .max(100, "Tax rate cannot exceed 100"),

    legal_mentions: z.string()
        .min(1, "Legal mentions are required"),

    footer: z.string()
        .min(1, "Footer is required"),
});

// Create a type from the schema
export type BillingModelForm = z.infer<typeof BillingModelFormSchema>;
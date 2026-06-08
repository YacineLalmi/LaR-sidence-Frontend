import z from "zod";
import { inputNumberFieldSchema } from "../global/price-field.schema";
import { inputFilesValidation } from "../global/file-field.schema";
import { PostCodeSchema } from "../global/post-code.schema";

const MAX_DOCUMENT_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_DOCUMENT_TYPES = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/jpg"];

export const BienFormSchema = z
  .object({
    client_id: z.string().nullable(),
    bien_type_id: z.string().min(1, "Le type de bien est requis"),
    transaction_type_id: z.string().min(1, "Le type de transaction est requis"),
    bien_status_id: z.string().min(1, "Le statut est requis"),
    agent_id: z.string().nullable().optional(),
    price: inputNumberFieldSchema(),
    monthly_charges: inputNumberFieldSchema().nullable().optional(), // Nullable now
    wilaya_id: z.string().min(1, "La wilaya est requise"),
    commune_id: z.string().min(1, "La commune est requise"),

    adresse: z
      .string()
      .min(5, "L'adresse doit contenir au moins 5 caractères")
      .max(1000, "L'adresse ne peut pas dépasser 1000 caractères"),
    postal_code: PostCodeSchema.nullable().optional(), // Nullable now
    coordinates: z.string().nullable().optional(), // Nullable now

    // Description
    description: z.string().max(5000, "La description ne peut pas dépasser 5000 caractères").nullable().optional(),

    // Property Characteristics (Altered to be Nullable/Optional)
    total_surface: inputNumberFieldSchema(), // Kept required per business logic
    habitable_surface: inputNumberFieldSchema().nullable().optional(),
    developed_surface: inputNumberFieldSchema().nullable().optional(),
    floor_number: inputNumberFieldSchema().nullable().optional(),
    rooms_number: inputNumberFieldSchema().nullable().optional(),
    bedrooms_number: inputNumberFieldSchema().nullable().optional(),
    bathrooms_number: inputNumberFieldSchema().nullable().optional(),

    availability_date: z.date({
      error: "La date de disponibilité est requise",
    }),

    // Additional Information
    comment: z.string().max(2000, "Le commentaire ne peut pas dépasser 2000 caractères").nullable().optional(),

    exclusivity: z.boolean(),
    exclusivity_start: z.date().nullable().optional(),
    exclusivity_end: z.date().nullable().optional(),

    characteristics: z.array(z.number().int()),

    // 🔄 Kept exactly as they were originally
    new_images: inputFilesValidation({ maxSize: MAX_IMAGE_SIZE, acceptedTypes: ACCEPTED_IMAGE_TYPES }),
    deleted_images: z.array(z.string()).optional(),
    new_documents: inputFilesValidation({ maxSize: MAX_DOCUMENT_SIZE, acceptedTypes: ACCEPTED_DOCUMENT_TYPES }),
    deleted_documents: z.array(z.string()).optional(),
  })
  .refine(
    (data) => {
      if (data.exclusivity) {
        return data.exclusivity_start !== null && data.exclusivity_end !== null;
      }
      return true;
    },
    {
      message: "Les dates d'exclusivité sont requises si l'exclusivité est activée",
      path: ["exclusivity_start"],
    },
  )
  .refine(
    (data) => {
      if (data.exclusivity_start && data.exclusivity_end) {
        return data.exclusivity_end > data.exclusivity_start;
      }
      return true;
    },
    {
      message: "La date de fin d'exclusivité doit être après la date de début",
      path: ["exclusivity_end"],
    },
  );

export type BienForm = z.infer<typeof BienFormSchema>;
export type BienFormInput = z.input<typeof BienFormSchema>;
export type BienFormOutput = z.output<typeof BienFormSchema>;
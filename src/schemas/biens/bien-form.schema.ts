import z from "zod";
import { inputNumberFieldSchema } from "../global/price-field.schema";
import { inputFilesValidation } from "../global/file-field.schema";
import { PostCodeSchema } from "../global/post-code.schema";

const MAX_DOCUMENT_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_DOCUMENT_TYPES = ["application/pdf"];

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
    monthly_charges: inputNumberFieldSchema().optional(),
    wilaya_id: z.string().min(1, "La wilaya est requise"),
    commune_id: z.string().min(1, "La commune est requise"),
    priority_id: z.string().min(1, "La priorité est requise"),
    adresse: z
      .string()
      .min(5, "L'adresse doit contenir au moins 5 caractères")
      .max(1000, "L'adresse ne peut pas dépasser 1000 caractères"),
    postal_code: PostCodeSchema
      .nullable()
      .optional(),
    coordinates: z.string().nullable().optional(),

    // Description
    description: z.string().max(5000, "La description ne peut pas dépasser 5000 caractères").nullable().optional(),

    // Property Characteristics
    habitable_surface: inputNumberFieldSchema(),
    total_surface: inputNumberFieldSchema(),
    developed_surface: inputNumberFieldSchema().optional(),
    floor_number: inputNumberFieldSchema(),
    rooms_number: inputNumberFieldSchema(),
    bedrooms_number: inputNumberFieldSchema(),
    bathrooms_number: inputNumberFieldSchema(),
    availability_date: z.date({
      error: "La date de disponibilité est requise",
    }),

    // Additional Information
    comment: z.string().max(2000, "Le commentaire ne peut pas dépasser 2000 caractères").nullable().optional(),

    exclusivity: z.boolean(),
    exclusivity_start: z.date().nullable().optional(),
    exclusivity_end: z.date().nullable().optional(),

    characteristics: z.array(z.number().int()),

    images: inputFilesValidation({ maxSize: MAX_IMAGE_SIZE, acceptedTypes: ACCEPTED_IMAGE_TYPES }),
    documents: inputFilesValidation({ maxSize: MAX_DOCUMENT_SIZE, acceptedTypes: ACCEPTED_DOCUMENT_TYPES }),
  })
  .refine(
    (data) => {
      return data.habitable_surface <= data.total_surface;
    },
    {
      message: "La surface habitable ne peut pas dépasser la surface totale",
      path: ["habitable_surface"],
    },
  )
  .refine(
    (data) => {
      return data.bedrooms_number <= data.rooms_number;
    },
    {
      message: "Le nombre de chambres ne peut pas dépasser le nombre de pièces",
      path: ["bedrooms_number"],
    },
  )
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

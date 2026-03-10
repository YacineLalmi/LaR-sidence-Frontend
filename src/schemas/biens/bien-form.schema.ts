import z from "zod";

const MAX_DOCUMENT_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_DOCUMENT_TYPES = ["application/pdf"];

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/jpg"];

export const BienFormSchema = z
  .object({
    client_id: z.string(),
    // title: z
    //   .string()
    //   .min(3, "Le titre doit contenir au moins 3 caractères")
    //   .max(255, "Le titre ne peut pas dépasser 255 caractères"),
    bien_type_id: z.string().min(1, "Le type de bien est requis"),
    transaction_type_id: z.string().min(1, "Le type de transaction est requis"),
    bien_status_id: z.string().min(1, "Le statut est requis"),
    agent_id: z.string().nullable().optional(),
    price: z.number().positive("Le prix doit être positif").max(999999999999999, "Le prix est trop élevé"),

    monthly_charges: z
      .number()
      .positive("Les charges mensuelles doivent être positives")
      .max(999999999999999, "Les charges sont trop élevées")
      .nullable()
      .optional(),

    wilaya_id: z.string().min(1, "La wilaya est requise"),
    commune_id: z.string().min(1, "La commune est requise"),
    priority_id: z.string().min(1, "La priorité est requise"),
    adresse: z
      .string()
      .min(5, "L'adresse doit contenir au moins 5 caractères")
      .max(1000, "L'adresse ne peut pas dépasser 1000 caractères"),
    postal_code: z
      .string()
      .regex(/^\d{5}$/, "Le code postal doit contenir 5 chiffres")
      .nullable()
      .optional(),
    coordinates: z.string().nullable().optional(),

    // Description
    description: z.string().max(5000, "La description ne peut pas dépasser 5000 caractères").nullable().optional(),

    // Property Characteristics
    habitable_surface: z
      .number()
      .positive("La surface habitable doit être positive")
      .max(999999, "La surface habitable est trop grande"),
    total_surface: z
      .number()
      .positive("La surface totale doit être positive")
      .max(999999, "La surface totale est trop grande"),
    developed_surface: z
      .number()
      .positive("La surface développée doit être positive")
      .max(999999, "La surface développée est trop grande")
      .nullable()
      .optional(),
    floor_number: z
      .number()
      .int("Le nombre d'étages doit être un entier")
      .min(0, "Le nombre d'étages ne peut pas être négatif")
      .max(200, "Le nombre d'étages est trop élevé"),
    rooms_number: z
      .number()
      .int("Le nombre de pièces doit être un entier")
      .positive("Le nombre de pièces doit être positif")
      .max(100, "Le nombre de pièces est trop élevé"),
    bedrooms_number: z
      .number()
      .int("Le nombre de chambres doit être un entier")
      .min(0, "Le nombre de chambres ne peut pas être négatif")
      .max(50, "Le nombre de chambres est trop élevé"),
    bathrooms_number: z
      .number()
      .int("Le nombre de salles de bain doit être un entier")
      .min(0, "Le nombre de salles de bain ne peut pas être négatif")
      .max(50, "Le nombre de salles de bain est trop élevé"),
    availability_date: z.date({
      error: "La date de disponibilité est requise",
    }),

    // Additional Information
    comment: z.string().max(2000, "Le commentaire ne peut pas dépasser 2000 caractères").nullable().optional(),

    exclusivity: z.boolean(),
    exclusivity_start: z.date().nullable().optional(),
    exclusivity_end: z.date().nullable().optional(),

    additional_characteristics: z.array(z.number().int()),

    images: z
      .array(z.instanceof(File))
      .min(1, "At least one file is required")
      // .max(10, "You can upload up to 5 files")
      .refine((files) => files.every((file) => file.size <= MAX_IMAGE_SIZE), "Each file must be 5MB or less")
      .refine((files) => files.every((file) => ACCEPTED_IMAGE_TYPES.includes(file.type)), "Only PDF files are allowed"),

    documents: z
      .array(z.instanceof(File))
      // .max(10, "You can upload up to 10 files")
      .refine((files) => files.every((file) => file.size <= MAX_DOCUMENT_SIZE), "Each file must be 5MB or less")
      .refine(
        (files) => files.every((file) => ACCEPTED_DOCUMENT_TYPES.includes(file.type)),
        "Only PDF files are allowed",
      ),
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

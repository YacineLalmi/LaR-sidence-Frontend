import z from "zod";
import { WilayaSchema } from "../wilayas/wilaya.schema";
import { CommuneSchema } from "../communes/commune.schema";
import { UserSchema } from "../users/user.schema";
import { FileSchema } from "../file/file.schema";
import { ClientSchema } from "../clients/client.schema";
import { PriceSchema } from "../price/price.schema";
import { ClassificationSchema } from "../classification/classification.schema";

export const BienSchema = z.object({
  id: z.string(),
  client: ClientSchema.optional(),
  title: z.string().nullable().optional(),
  adresse: z.string(),
  postal_code: z.string(),
  coordinates: z.string(),
  wilaya: WilayaSchema.optional(),
  commune: CommuneSchema.optional(),
  type: ClassificationSchema.optional(),
  price: z.number().nullable().optional(),
  prices: z.array(PriceSchema).optional(),
  monthly_charges: z.number(),
  transaction_type: ClassificationSchema.optional(),
  status: ClassificationSchema.optional(),
  description: z.string().nullable(),
  habitable_surface: z.number(),
  total_surface: z.number(),
  developed_surface: z.number().nullable().optional(),
  floor_number: z.number(),
  rooms_number: z.number(),
  bedrooms_number: z.number(),
  bathrooms_number: z.number(),
  availability_date: z.iso.date(),
  comment: z.string().nullable().optional(),
  exclusivity: z.boolean(),
  exclusivity_start: z.iso.date().nullable(),
  exclusivity_end: z.iso.date().nullable(),
  agent: UserSchema.optional(),
  characteristics: z.array(ClassificationSchema).optional(),
  documents: z.array(FileSchema).optional(),
  images: z.array(FileSchema).optional(),
  priority: ClassificationSchema.optional(),
  created_at: z.iso.datetime(),
  updated_at: z.iso.datetime(),
  deleted_at: z.iso.datetime().nullable(),
});

export type Bien = z.infer<typeof BienSchema>;

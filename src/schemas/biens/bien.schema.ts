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
  client: ClientSchema.nullable().optional(),
  title: z.string().nullable().optional(),
  adresse: z.string(),
  postal_code: z.string().nullable(),
  coordinates: z.string().nullable(),
  wilaya: WilayaSchema.nullable().optional(),
  commune: CommuneSchema.nullable().optional(),
  type: ClassificationSchema.nullable().optional(),
  price: z.number().nullable().optional(),
  prices: z.array(PriceSchema).optional(),
  monthly_charges: z.number().nullable().optional(),
  transaction_type: ClassificationSchema.nullable().optional(),
  status: ClassificationSchema.nullable().optional(),
  description: z.string().nullable(),
  total_surface: z.number(),
  habitable_surface: z.number().nullable(),
  developed_surface: z.number().nullable(),
  floor_number: z.number().nullable(),
  rooms_number: z.number().nullable(),
  bedrooms_number: z.number().nullable(),
  bathrooms_number: z.number().nullable(),
  availability_date: z.iso.date(),
  comment: z.string().nullable().optional(),
  exclusivity: z.boolean(),
  exclusivity_start: z.iso.date().nullable(),
  exclusivity_end: z.iso.date().nullable(),
  agent: UserSchema.nullable().optional(),
  characteristics: z.array(ClassificationSchema).optional(),
  documents: z.array(FileSchema).optional(),
  images: z.array(FileSchema).optional(),
  created_at: z.iso.datetime(),
  updated_at: z.iso.datetime(),
  deleted_at: z.iso.datetime().nullable(),
});

export type Bien = z.infer<typeof BienSchema>;

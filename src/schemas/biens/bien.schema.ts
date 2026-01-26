import z from "zod";
import { WilayaSchema } from "../wilayas/wilaya.schema";
import { CommuneSchema } from "../communes/commune.schema";
import { BienTypeSchema } from "../bien-type/bien-type.schema";
import { TransactionTypeSchema } from "../transaction-type/transaction-type.schema";
import { UserSchema } from "../users/user.schema";
import { BienAdditionalcharacteristicsSchema } from "../bien-additional-characteristics/bien-addtional-characteristics.schema";
import { FileSchema } from "../file/file.schema";
import { ClientSchema } from "../clients/client.schema";
import { BienPrioritySchema } from "../BienPriority.schema";
import { BienStatusSchema } from "../bien-status/bien-status.schema";
import { PriceSchema } from "../price/price.schema";

export const BienSchema = z.object({
  id: z.number(),
  client: ClientSchema,
  title: z.string(),
  adresse: z.string(),
  postal_code: z.string(),
  coordinates: z.string(),
  wilaya: WilayaSchema,
  commune: CommuneSchema,
  type: BienTypeSchema,
  price: z.number(),
  prices: z.array(PriceSchema),
  monthly_charges: z.number(),
  transaction_type: TransactionTypeSchema,
  status: BienStatusSchema,
  description: z.string().nullable(),
  habitable_surface: z.number(),
  total_surface: z.number(),
  developed_surface: z.number(),
  floor_number: z.number(),
  rooms_number: z.number(),
  bedrooms_number: z.number(),
  bathrooms_number: z.number(),
  availability_date: z.iso.datetime(),
  comment: z.string().nullable().optional(),
  exclusivity: z.boolean(),
  exclusivity_start: z.iso.datetime().nullable(),
  exclusivity_end: z.iso.datetime().nullable(),
  agent: UserSchema,
  additional_characteristics: z.array(BienAdditionalcharacteristicsSchema),
  documents: z.array(FileSchema),
  images: z.array(FileSchema),
  priority: BienPrioritySchema,
  created_at: z.iso.datetime(),
  updated_at: z.iso.datetime().nullable(),
  deleted_at: z.iso.datetime().nullable(),
});

export type Bien = z.infer<typeof BienSchema>;

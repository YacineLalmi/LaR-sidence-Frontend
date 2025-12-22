import z from "zod";
import { WilayaSchema } from "../wilayas/wilaya.schema";
import { CommuneSchema } from "../communes/commune.schema";
import { BienTypeSchema } from "../bien-type/bien-type.schema";
import { TransactionTypeSchema } from "../transaction-type/transaction-type.schema";
import { UserSchema } from "../users/user.schema";
import { BienStatusSchema } from "../BienStatus.schema";
import { BienAdditionalcharacteristicsSchema } from "../bien-additional-characteristics/bien-addtional-characteristics.schema";
import { FileSchema } from "../file/file.schema";
import images from "@/lib/images";
import { FileBlobSchema } from "../file/file-blob.schema";

const MAX_DOCUMENT_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_DOCUMENT_TYPES = ["application/pdf"];

export const BienSchema = z.object({
  client_id: z.number(),
  title: z.string().nullable().optional(),
  adresse: z.string().nullable().optional(),
  postal_code: z.string().nullable().optional(),
  wilaya: WilayaSchema.nullable().optional(),
  commune: CommuneSchema.nullable().optional(),
  bien_type: BienTypeSchema.nullable().optional(),
  price: z.number(),
  transaction_type: TransactionTypeSchema,
  bien_status: BienStatusSchema,
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
  first_image: FileBlobSchema.nullable(),
  created_at: z.iso.datetime(),
  updated_at: z.iso.datetime().nullable(),
  deleted_at: z.iso.datetime().nullable(),
});

export type Bien = z.infer<typeof BienSchema>;

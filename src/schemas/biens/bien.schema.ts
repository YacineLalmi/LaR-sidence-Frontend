import z from "zod";
import { WilayaSchema } from "../wilayas/wilaya.schema";
import { CommuneSchema } from "../communes/commune.schema";
import { BienTypeSchema } from "../bien-type/bien-type.schema";
import { TransactionTypeSchema } from "../transaction-type/transaction-type.schema";
import { UserSchema } from "../users/user.schema";

// Status schema for biens (from status table)
const StatusSchema = z.object({
  id: z.union([z.number(), z.string()]).transform((val) => typeof val === 'string' ? val : String(val)),
  code: z.string(),
  name: z.string(),
  description: z.string().nullable().optional(),
  is_active: z.union([z.boolean(), z.number()]).transform((val) => {
    if (typeof val === 'number') return val === 1;
    return val;
  }),
  color: z.string().nullable().optional(),
  created_at: z.union([z.string(), z.iso.datetime()]).nullable().optional(),
  updated_at: z.union([z.string(), z.iso.datetime()]).nullable().optional(),
  deleted_at: z.union([z.string(), z.iso.datetime()]).nullable().optional(),
});

export const BienSchema = z.object({
  id: z.union([z.number(), z.string()]).transform((val) => typeof val === 'string' ? val : String(val)),
  title: z.string().nullable().optional(),
  adresse: z.string().nullable().optional(),
  postal_code: z.string().nullable().optional(),
  wilaya: WilayaSchema.nullable().optional(),
  commune: CommuneSchema.nullable().optional(),
  bien_type: BienTypeSchema.nullable().optional(),
  price: z.union([z.number(), z.string()]).transform((val) => typeof val === 'string' ? parseFloat(val) : val).nullable().optional(),
  transaction_type: TransactionTypeSchema.nullable().optional(),
  status: StatusSchema.nullable().optional(),
  description: z.string().nullable().optional(),
  habitable_surface: z.union([z.number(), z.string()]).transform((val) => typeof val === 'string' ? parseFloat(val) : val).nullable().optional(),
  total_surface: z.union([z.number(), z.string()]).transform((val) => typeof val === 'string' ? parseFloat(val) : val).nullable().optional(),
  developed_surface: z.union([z.number(), z.string()]).transform((val) => typeof val === 'string' ? parseFloat(val) : val).nullable().optional(),
  floor_number: z.union([z.number(), z.string()]).transform((val) => typeof val === 'string' ? parseInt(val) : val).nullable().optional(),
  rooms_number: z.union([z.number(), z.string()]).transform((val) => typeof val === 'string' ? parseInt(val) : val).nullable().optional(),
  bedrooms_number: z.union([z.number(), z.string()]).transform((val) => typeof val === 'string' ? parseInt(val) : val).nullable().optional(),
  bathrooms_number: z.union([z.number(), z.string()]).transform((val) => typeof val === 'string' ? parseInt(val) : val).nullable().optional(),
  availability_date: z.union([z.string(), z.iso.datetime()]).nullable().optional(),
  comment: z.string().nullable().optional(),
  exclusivity: z.union([z.boolean(), z.number(), z.string()]).transform((val) => {
    if (typeof val === 'number') return val === 1;
    if (typeof val === 'string') return val === '1' || val.toLowerCase() === 'true';
    return val;
  }).nullable().optional(),
  exclusivity_start: z.union([z.string(), z.iso.datetime()]).nullable().optional(),
  exclusivity_end: z.union([z.string(), z.iso.datetime()]).nullable().optional(),
  agent: UserSchema.extend({
    id: z.union([z.number(), z.string()]).transform((val) => typeof val === 'string' ? val : String(val)),
    role: z.any().nullable().optional(),
    permissions: z.array(z.any()).nullable().optional(),
  }).nullable().optional(),
  documents: z.array(z.any()).nullable().optional(),
  created_at: z.union([z.string(), z.iso.datetime()]).nullable().optional(),
  updated_at: z.union([z.string(), z.iso.datetime()]).nullable().optional(),
  deleted_at: z.union([z.string(), z.iso.datetime()]).nullable().optional(),
});

export type Bien = z.infer<typeof BienSchema>;

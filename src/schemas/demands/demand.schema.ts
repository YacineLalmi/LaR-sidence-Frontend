import z from "zod";
import { ClientSchema } from "../clients/client.schema";

// Simplified Bien schema for demands
const BienResourcesSchema = z.object({
  id: z.string(),
  title: z.string().nullable().optional(),
  adresse: z.string().nullable().optional(),
}).nullable().optional();

// Simplified User schema for agent
const UserSchema = z.object({
  id: z.string(),
  first_name: z.string().nullable().optional(),
  last_name: z.string().nullable().optional(),
}).nullable().optional();

// DemandType schema
const DemandTypeSchema = z.object({
  id: z.string(),
  name: z.string(),
  code: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
}).nullable().optional();

// DemandStatus schema
const DemandStatusSchema = z.object({
  id: z.string(),
  name: z.string(),
  code: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
}).nullable().optional();

// DemandPriority schema
const DemandPrioritySchema = z.object({
  id: z.string(),
  name: z.string(),
  code: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
}).nullable().optional();

// DemandSource schema
const DemandSourceSchema = z.object({
  id: z.string(),
  name: z.string(),
  code: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
}).nullable().optional();

export const DemandSchema = z.object({
  id: z.string(),
  title: z.string(),
  type: DemandTypeSchema,
  type_id: z.string().nullable().optional(),
  client: ClientSchema.nullable().optional(),
  client_id: z.string().nullable().optional(),
  source: DemandSourceSchema.nullable().optional(),
  source_id: z.string().nullable().optional(),
  bien: BienResourcesSchema,
  bien_id: z.string().nullable().optional(),
  agent: UserSchema,
  agent_id: z.string().nullable().optional(),
  status: DemandStatusSchema.nullable().optional(),
  status_id: z.string().nullable().optional(),
  priority: DemandPrioritySchema.nullable().optional(),
  priority_id: z.string().nullable().optional(),
  budget: z.union([z.number(), z.string()]).transform((val) => typeof val === 'string' ? parseFloat(val) || 0 : val).nullable().optional(),
  comment: z.string().nullable().optional(),
  created_at: z.union([z.string(), z.iso.datetime()]).transform((val) => {
    if (typeof val === 'string') {
      try {
        new Date(val);
        return val;
      } catch {
        return val;
      }
    }
    return val;
  }),
  updated_at: z.union([z.string(), z.iso.datetime()]).nullable().optional(),
  deleted_at: z.union([z.string(), z.iso.datetime()]).nullable().optional(),
});

export type Demand = z.infer<typeof DemandSchema>;


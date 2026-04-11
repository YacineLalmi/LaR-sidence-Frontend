import { z } from "zod";
import { NOTIFICATION_CATEGORIES, NOTIFICATION_PRIORITIES } from "./notification.constants";

export const NotificationUserSchema = z
  .object({
    id: z.union([z.string(), z.number()]),
    first_name: z.string().optional(),
    last_name: z.string().optional(),
    email: z.string().optional(),
  })
  .nullable()
  .optional();

export const NotificationSchema = z
  .object({
    id: z.union([z.string(), z.number()]),
    title: z.string(),
    message: z.string(),
    type: z.union([z.enum(NOTIFICATION_CATEGORIES), z.string()]),
    is_read: z.coerce.boolean().optional().default(false),
    priority: z.union([z.enum(NOTIFICATION_PRIORITIES), z.string()]).optional().default("NORMAL"),
    // API uses admin/agent; legacy rows may differ
    target_role: z.string().nullable().optional(),
    severity: z.string().optional().default("medium"),
    channel: z.string().optional().default("in_app"),
    entity_type: z.string().nullable().optional(),
    entity_id: z.union([z.string(), z.number()]).nullable().optional(),
    // Laravel `meta` cast can JSON-encode as [] or {}
    meta: z.any().nullable().optional(),
    read_at: z.string().nullable().optional(),
    scheduled_for: z.string().nullable().optional(),
    created_at: z.string().optional(),
    updated_at: z.string().optional(),
    deleted_at: z.string().nullable().optional(),
    user: NotificationUserSchema.optional(),
  })
  .passthrough();

export type Notification = z.infer<typeof NotificationSchema>;

/** Laravel `pluck()->all()` on empty groups yields `[]`, which JSON encodes as [] — not a record. */
function normalizeCategoryCounts(val: unknown): Record<string, number> {
  if (val === null || val === undefined) {
    return {};
  }
  if (Array.isArray(val)) {
    return {};
  }
  if (typeof val !== "object") {
    return {};
  }
  const out: Record<string, number> = {};
  for (const [k, v] of Object.entries(val as Record<string, unknown>)) {
    const n = typeof v === "number" ? v : Number(v);
    if (!Number.isNaN(n)) {
      out[k] = n;
    }
  }
  return out;
}

const NotificationBucketSchema = z.object({
  count: z.coerce.number(),
  by_category: z.preprocess(normalizeCategoryCounts, z.record(z.string(), z.coerce.number())),
  preview: z.array(NotificationSchema),
});

export const NotificationAggregatesSchema = z
  .object({
    buckets: z.object({
      urgent: NotificationBucketSchema,
      today: NotificationBucketSchema,
      to_follow: NotificationBucketSchema,
      history: NotificationBucketSchema,
    }),
  })
  .passthrough();

export type NotificationAggregates = z.infer<typeof NotificationAggregatesSchema>;

export const NotificationSettingSchema = z.object({
  id: z.union([z.string(), z.number()]).optional(),
  key: z.string(),
  value_json: z.any().optional(),
  enabled: z.boolean().optional().default(true),
  channel_in_app: z.boolean().optional().default(true),
  channel_email: z.boolean().optional().default(false),
  scope: z.enum(["admin", "agent", "both"]).optional().default("both"),
  description: z.string().nullable().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

export type NotificationSetting = z.infer<typeof NotificationSettingSchema>;


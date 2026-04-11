/** Canonical notification categories (aligned with backend `NotificationCategory`). */
export const NOTIFICATION_CATEGORIES = [
  "CONTRACT_EXPIRY",
  "APPOINTMENTS_VISITS",
  "AGENT_ACTIVITY",
  "PROPERTY_PERFORMANCE",
  "ACTION_FOLLOWUP",
  "RENTAL_PROCESS",
  "VISIT_FEEDBACK",
] as const;

export type NotificationCategoryId = (typeof NOTIFICATION_CATEGORIES)[number];

export const NOTIFICATION_PRIORITIES = ["CRITICAL", "IMPORTANT", "NORMAL"] as const;

export type NotificationPriorityId = (typeof NOTIFICATION_PRIORITIES)[number];

/** Seuil / paramètres du moteur (clés `NotificationSetting::DEFAULTS` côté API). */
export const NOTIFICATION_RULE_KEYS = [
  "contract_expiry_offsets_days",
  "meeting_today_reminder_minutes",
  "empty_calendar_working_days_threshold",
  "social_post_no_interaction_days",
  "visit_followup_after_minutes",
  "post_signature_admin_followup_hours",
  "post_edl_admin_followup_hours",
  "edl_after_signature_hours",
  "exclusive_reminder_every_days",
  "price_revision_after_days",
  "demand_followup_offsets_hours",
  "offer_followup_after_hours",
  "sales_visit_status_reminder_every_hours",
] as const;

export type NotificationRuleKey = (typeof NOTIFICATION_RULE_KEYS)[number];

export const NOTIFICATION_RULE_ARRAY_KEYS: readonly NotificationRuleKey[] = [
  "contract_expiry_offsets_days",
  "demand_followup_offsets_hours",
];

/** Règles moteur regroupées sous chaque catégorie (affichage UI uniquement ; clés API inchangées). */
export const NOTIFICATION_CATEGORY_RULES: Record<NotificationCategoryId, readonly NotificationRuleKey[]> = {
  CONTRACT_EXPIRY: ["contract_expiry_offsets_days", "exclusive_reminder_every_days"],
  APPOINTMENTS_VISITS: ["meeting_today_reminder_minutes"],
  AGENT_ACTIVITY: ["empty_calendar_working_days_threshold"],
  PROPERTY_PERFORMANCE: ["social_post_no_interaction_days", "price_revision_after_days"],
  ACTION_FOLLOWUP: ["demand_followup_offsets_hours", "offer_followup_after_hours"],
  RENTAL_PROCESS: [
    "visit_followup_after_minutes",
    "post_signature_admin_followup_hours",
    "post_edl_admin_followup_hours",
    "edl_after_signature_hours",
  ],
  VISIT_FEEDBACK: ["sales_visit_status_reminder_every_hours"],
};

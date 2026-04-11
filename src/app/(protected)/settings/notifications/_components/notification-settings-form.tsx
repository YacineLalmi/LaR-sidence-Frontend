"use client";

import { updateNotificationSettingsAction } from "@/actions/notifications/update-notification-settings.action";
import {
  NOTIFICATION_CATEGORIES,
  NOTIFICATION_CATEGORY_RULES,
  NOTIFICATION_RULE_ARRAY_KEYS,
  NOTIFICATION_RULE_KEYS,
  type NotificationCategoryId,
  type NotificationRuleKey,
} from "@/schemas/notifications/notification.constants";
import type { NotificationSetting } from "@/schemas/notifications/notification.schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Bell, Clock, Mail, Users } from "lucide-react";
import { type ReactNode, useMemo, useState, useTransition } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

const CATEGORY_SET = new Set<string>(NOTIFICATION_CATEGORIES);
const RULE_SET = new Set<string>(NOTIFICATION_RULE_KEYS);

function isRuleArrayKey(key: string): boolean {
  return (NOTIFICATION_RULE_ARRAY_KEYS as readonly string[]).includes(key);
}

function isRuleKey(key: string): key is NotificationRuleKey {
  return RULE_SET.has(key);
}

function ruleValueToString(key: string, value: unknown): string {
  if (isRuleArrayKey(key)) {
    if (Array.isArray(value)) return value.join(", ");
    return "";
  }
  if (typeof value === "number" && !Number.isNaN(value)) return String(value);
  if (value === null || value === undefined) return "";
  return String(value);
}

function parseRuleValueInput(key: string, raw: string): number | number[] {
  if (isRuleArrayKey(key)) {
    return raw
      .split(",")
      .map((s) => parseInt(s.trim(), 10))
      .filter((n) => !Number.isNaN(n));
  }
  const n = parseInt(raw.trim(), 10);
  return Number.isNaN(n) ? 0 : n;
}

function channelRow(props: {
  icon: ReactNode;
  titleId: string;
  title: string;
  description: string;
  checked: boolean;
  onCheckedChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-xl border border-stone-200/90 bg-white/80 p-3.5 shadow-sm dark:border-stone-800 dark:bg-stone-950/40">
      <div className="flex min-w-0 flex-1 gap-3">
        <div className="mt-0.5 shrink-0 text-stone-500 dark:text-stone-400">{props.icon}</div>
        <div className="min-w-0 space-y-0.5">
          <Label htmlFor={props.titleId} className="text-sm font-medium leading-snug text-foreground cursor-pointer">
            {props.title}
          </Label>
          <p className="text-xs leading-relaxed text-muted-foreground">{props.description}</p>
        </div>
      </div>
      <Switch
        id={props.titleId}
        className="shrink-0 mt-0.5"
        checked={props.checked}
        onCheckedChange={props.onCheckedChange}
      />
    </div>
  );
}

export default function NotificationSettingsForm({ initialSettings }: { initialSettings: NotificationSetting[] }) {
  const router = useRouter();
  const t = useTranslations("settings.notifications");
  const [settings, setSettings] = useState<NotificationSetting[]>(initialSettings);
  const [isPending, startTransition] = useTransition();

  const byKey = useMemo(() => {
    const m = new Map<string, NotificationSetting>();
    settings.forEach((s) => m.set(s.key, s));
    return m;
  }, [settings]);

  const otherRows = useMemo(
    () => settings.filter((s) => !CATEGORY_SET.has(s.key) && !RULE_SET.has(s.key)),
    [settings]
  );

  const setSetting = (key: string, patch: Partial<NotificationSetting>) => {
    setSettings((prev) => prev.map((item) => (item.key === key ? { ...item, ...patch } : item)));
  };

  const ruleMeta = (key: NotificationRuleKey, field: "title" | "desc" | "placeholder") =>
    (t as (k: string) => string)(`rules.${key}.${field}`);

  const renderRuleBlock = (cat: NotificationCategoryId, ruleKey: NotificationRuleKey) => {
    const ruleSetting = byKey.get(ruleKey);
    if (!ruleSetting || !isRuleKey(ruleKey)) {
      return (
        <div key={ruleKey} className="rounded-xl border border-dashed border-amber-200/80 bg-amber-50/40 p-4 text-sm text-muted-foreground dark:bg-amber-950/20">
          <span className="font-mono text-xs">{ruleKey}</span>
          <span className="mx-1">—</span>
          {t("missing_rule_hint")}
        </div>
      );
    }
    const applyId = `rule-apply-${cat}-${ruleKey}`;
    const inputId = `rule-val-${cat}-${ruleKey}`;
    const ruleOn = ruleSetting.enabled;

    return (
      <div
        key={ruleKey}
        className={cn(
          "rounded-xl border p-4 transition-colors",
          ruleOn ? "border-stone-200/90 bg-stone-50/50 dark:border-stone-800 dark:bg-stone-950/35" : "border-stone-200/60 bg-muted/20 opacity-90 dark:border-stone-800/80"
        )}
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
          <div className="flex min-w-0 flex-1 gap-3">
            <Clock className="h-4 w-4 shrink-0 text-stone-500 mt-0.5" aria-hidden />
            <div className="min-w-0 space-y-1">
              <p className="text-sm font-semibold leading-snug text-foreground">{ruleMeta(ruleKey, "title")}</p>
              <p className="text-xs leading-relaxed text-muted-foreground">{ruleMeta(ruleKey, "desc")}</p>
            </div>
          </div>
          <div className="flex shrink-0 flex-col items-end gap-1 sm:pt-0.5">
            <div className="flex items-center gap-2">
              <Label htmlFor={applyId} className="text-xs font-medium text-foreground cursor-pointer whitespace-nowrap">
                {t("fields.rule_apply")}
              </Label>
              <Switch
                id={applyId}
                checked={ruleOn}
                onCheckedChange={(v) => setSetting(ruleKey, { enabled: v })}
              />
            </div>
            <p className="max-w-[220px] text-right text-[11px] leading-tight text-muted-foreground">{t("fields.rule_apply_hint")}</p>
          </div>
        </div>

        <div className="mt-4 space-y-1.5 pl-0 sm:pl-7">
          <Label htmlFor={inputId} className="text-xs font-medium text-muted-foreground">
            {t("fields.value")}
          </Label>
          <Input
            id={inputId}
            disabled={!ruleOn}
            className="h-10 max-w-full sm:max-w-md font-mono text-sm"
            value={ruleValueToString(ruleKey, ruleSetting.value_json)}
            placeholder={ruleMeta(ruleKey, "placeholder")}
            onChange={(e) =>
              setSetting(ruleKey, { value_json: parseRuleValueInput(ruleKey, e.target.value) as unknown })
            }
          />
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">{t("title")}</h1>
          <p className="text-sm text-muted-foreground mt-2 max-w-2xl leading-relaxed">{t("subtitle")}</p>
        </div>
        <Button
          className="rounded-full shrink-0 h-11 px-6"
          onClick={() =>
            startTransition(async () => {
              const toSave = settings.map((item) => {
                if (CATEGORY_SET.has(item.key)) {
                  return {
                    ...item,
                    enabled: item.channel_in_app || item.channel_email,
                  };
                }
                return item;
              });
              const res = await updateNotificationSettingsAction(toSave);
              if (!res.isOk) {
                toast.error(res.errorMessage || t("save_error"));
                return;
              }
              toast.success(t("saved"));
              router.refresh();
            })
          }
          disabled={isPending}
        >
          {t("save")}
        </Button>
      </div>

      <section className="space-y-5">
        <header className="space-y-1.5">
          <h2 className="text-lg font-semibold tracking-tight">{t("sections.categories")}</h2>
          <p className="text-sm text-muted-foreground max-w-3xl leading-relaxed">{t("sections.categories_hint")}</p>
        </header>

        <div className="grid gap-6 lg:grid-cols-2">
          {NOTIFICATION_CATEGORIES.map((cat) => {
            const setting = byKey.get(cat);
            const ruleKeys = NOTIFICATION_CATEGORY_RULES[cat];

            if (!setting) {
              return (
                <Card key={cat} className="border-dashed border-2 rounded-2xl">
                  <CardHeader>
                    <CardTitle className="text-base text-muted-foreground font-mono">{cat}</CardTitle>
                    <CardDescription>{t("missing_category_hint")}</CardDescription>
                  </CardHeader>
                </Card>
              );
            }

            return (
              <Card key={cat} className="overflow-hidden rounded-2xl border-stone-200/90 shadow-md dark:border-stone-800">
                <CardHeader className="space-y-1.5 border-b border-stone-100 bg-stone-50/80 pb-4 dark:border-stone-800 dark:bg-stone-900/40">
                  <CardTitle className="text-lg font-semibold leading-tight">
                    {t(`categories.${cat}` as "categories.CONTRACT_EXPIRY")}
                  </CardTitle>
                  <CardDescription className="text-sm leading-relaxed">{t(`categoryDescriptions.${cat}` as "categoryDescriptions.CONTRACT_EXPIRY")}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-semibold text-foreground">{t("fields.channels_heading")}</p>
                      <p className="text-xs text-muted-foreground mt-1">{t("fields.channels_hint")}</p>
                    </div>
                    <div className="space-y-2.5">
                      {channelRow({
                        icon: <Bell className="h-4 w-4" aria-hidden />,
                        titleId: `ch-in-${cat}`,
                        title: t("fields.channel_in_app"),
                        description: t("fields.channel_in_app_hint"),
                        checked: setting.channel_in_app,
                        onCheckedChange: (v) => setSetting(setting.key, { channel_in_app: v }),
                      })}
                      {channelRow({
                        icon: <Mail className="h-4 w-4" aria-hidden />,
                        titleId: `ch-mail-${cat}`,
                        title: t("fields.channel_email"),
                        description: t("fields.channel_email_hint"),
                        checked: setting.channel_email,
                        onCheckedChange: (v) => setSetting(setting.key, { channel_email: v }),
                      })}
                    </div>

                    <div className="rounded-xl border border-stone-200/90 bg-white/80 p-3.5 shadow-sm dark:border-stone-800 dark:bg-stone-950/40">
                      <div className="flex gap-3">
                        <Users className="h-4 w-4 shrink-0 text-stone-500 mt-1" aria-hidden />
                        <div className="min-w-0 flex-1 space-y-2">
                          <div>
                            <Label className="text-sm font-medium">{t("fields.scope")}</Label>
                            <p className="text-xs text-muted-foreground mt-0.5">{t("fields.scope_hint")}</p>
                          </div>
                          <Select
                            value={setting.scope ?? "both"}
                            onValueChange={(value) =>
                              setSetting(setting.key, { scope: value as "admin" | "agent" | "both" })
                            }
                          >
                            <SelectTrigger className={cn("h-10 w-full rounded-lg")}>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="admin">{t("fields.scope_admin")}</SelectItem>
                              <SelectItem value="agent">{t("fields.scope_agent")}</SelectItem>
                              <SelectItem value="both">{t("fields.scope_both")}</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator className="bg-stone-200/80" />

                  <div className="space-y-3">
                    <p className="text-sm font-semibold text-foreground">{t("fields.thresholds")}</p>
                    <div className="space-y-4">{ruleKeys.map((rk) => renderRuleBlock(cat, rk))}</div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {otherRows.length > 0 && (
        <>
          <Separator />
          <section className="space-y-3">
            <h2 className="text-lg font-medium">{t("sections.other")}</h2>
            <div className="space-y-4">
              {otherRows.map((row) => (
                <Card key={row.key} className="rounded-2xl">
                  <CardHeader>
                    <CardTitle className="text-base font-mono">{row.key}</CardTitle>
                  </CardHeader>
                  <CardContent className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2 md:col-span-2">
                      <Label>{t("fields.value")}</Label>
                      <Input
                        value={JSON.stringify(row.value_json ?? null)}
                        onChange={(e) => {
                          const raw = e.target.value;
                          try {
                            setSetting(row.key, { value_json: JSON.parse(raw) });
                          } catch {
                            /* ignore until valid JSON */
                          }
                        }}
                      />
                    </div>
                    <label className="flex items-center gap-2">
                      <Checkbox
                        checked={row.enabled}
                        onCheckedChange={(checked) => setSetting(row.key, { enabled: checked === true })}
                      />
                      <span className="text-sm">{t("fields.enabled")}</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <Checkbox
                        checked={row.channel_in_app}
                        onCheckedChange={(checked) => setSetting(row.key, { channel_in_app: checked === true })}
                      />
                      <span className="text-sm">{t("fields.channel_in_app")}</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <Checkbox
                        checked={row.channel_email}
                        onCheckedChange={(checked) => setSetting(row.key, { channel_email: checked === true })}
                      />
                      <span className="text-sm">{t("fields.channel_email")}</span>
                    </label>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}

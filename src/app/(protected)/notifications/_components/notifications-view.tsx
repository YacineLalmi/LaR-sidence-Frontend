"use client";

import { deleteNotificationAction, markAllNotificationsReadAction, markNotificationReadAction } from "@/actions/notifications/mark-notification-read.action";
import { notificationEntityHref } from "@/lib/notification-entity-link";
import { NOTIFICATION_CATEGORIES, type NotificationCategoryId } from "@/schemas/notifications/notification.constants";
import { Notification, NotificationAggregates } from "@/schemas/notifications/notification.schema";
import { PaginatedResponse } from "@/lib/definitions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Bell, CircleAlert, CircleX, Filter, Search, Trash2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState, useTransition } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { DeleteConfirmationDialog } from "@/components/ui/delete-confirmation-dialog";

function priorityIcon(priority?: string) {
  if (priority === "CRITICAL") return <CircleX className="h-5 w-5 text-red-500" />;
  if (priority === "IMPORTANT") return <CircleAlert className="h-5 w-5 text-orange-500" />;
  return <Bell className="h-5 w-5 text-amber-600" />;
}

function pillInputClass() {
  return cn(
    "h-11 w-full rounded-full border border-foreground/90 bg-white px-4 text-sm shadow-none",
    "placeholder:text-muted-foreground/70 focus-visible:ring-1 focus-visible:ring-foreground"
  );
}

function NotificationDeleteButton({
  id,
  deleteTitle,
  deleteDescription,
}: {
  id: string | number;
  deleteTitle: string;
  deleteDescription: string;
}) {
  const router = useRouter();
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const onSuccess = useCallback(() => {
    setIsDeleteOpen(false);
    router.refresh();
  }, [router]);

  return (
    <DeleteConfirmationDialog
      title={deleteTitle}
      description={deleteDescription}
      isOpen={isDeleteOpen}
      setIsOpen={setIsDeleteOpen}
      confirmAction={() => deleteNotificationAction(id)}
      onSuccess={onSuccess}
      trigger={
        <Button size="icon" variant="ghost">
          <Trash2 className="h-4 w-4" />
        </Button>
      }
    />
  );
}

function isNotificationCategory(type: string): type is NotificationCategoryId {
  return (NOTIFICATION_CATEGORIES as readonly string[]).includes(type);
}

function BucketSummaryCard({
  title,
  description,
  count,
  accentClass,
}: {
  title: string;
  description: string;
  count: number;
  accentClass: string;
}) {
  return (
    <Card className={cn("border shadow-sm overflow-hidden", accentClass)}>
      <CardHeader className="pb-2 space-y-1">
        <CardTitle className="text-sm font-semibold leading-tight">{title}</CardTitle>
        <p className="text-xs text-muted-foreground leading-snug">{description}</p>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-3xl font-bold tabular-nums">{count}</p>
      </CardContent>
    </Card>
  );
}

export default function NotificationsView({
  initialData,
  aggregates,
}: {
  initialData: PaginatedResponse<Notification>;
  aggregates: NotificationAggregates;
}) {
  const t = useTranslations("notifications");
  const deleteConfirmTitle = t("delete_confirm_title");
  const deleteConfirmDescription = t("delete_confirm_description");
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [isPending, startTransition] = useTransition();
  const selectedPriority = searchParams.get("priority") || "";
  const selectedRead = searchParams.get("is_read") || "";
  const selectedType = searchParams.get("type") || "";
  const page = initialData.meta?.page || 1;
  const totalPages = initialData.meta?.totalPages || 1;
  const [sheetOpen, setSheetOpen] = useState(false);
  const [draftPriority, setDraftPriority] = useState(selectedPriority);
  const [draftRead, setDraftRead] = useState(selectedRead);
  const [draftType, setDraftType] = useState(selectedType);

  const data = initialData.data ?? [];
  const { buckets } = aggregates;

  const unreadOnPage = useMemo(() => data.filter((n) => !n.is_read).length, [data]);

  const pushQuery = (updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([k, v]) => {
      if (!v) params.delete(k);
      else params.set(k, v);
    });
    router.push(`/notifications?${params.toString()}`);
  };

  const onMarkAll = () =>
    startTransition(async () => {
      const res = await markAllNotificationsReadAction();
      if (!res.isOk) {
        toast.error(res.errorMessage || "Impossible");
        return;
      }
      toast.success(t("mark_all_success"));
      router.refresh();
    });

  useEffect(() => {
    if (!sheetOpen) return;
    setDraftPriority(searchParams.get("priority") || "");
    setDraftRead(searchParams.get("is_read") || "");
    setDraftType(searchParams.get("type") || "");
  }, [sheetOpen, searchParams]);

  return (
    <div className="space-y-5">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <BucketSummaryCard
          title={t("bucket_urgent_title")}
          description={t("bucket_urgent_desc")}
          count={buckets.urgent.count}
          accentClass="border-red-200/80 bg-red-50/40 dark:bg-red-950/20"
        />
        <BucketSummaryCard
          title={t("bucket_today_title")}
          description={t("bucket_today_desc")}
          count={buckets.today.count}
          accentClass="border-amber-200/80 bg-amber-50/40 dark:bg-amber-950/20"
        />
        <BucketSummaryCard
          title={t("bucket_follow_title")}
          description={t("bucket_follow_desc")}
          count={buckets.to_follow.count}
          accentClass="border-sky-200/80 bg-sky-50/40 dark:bg-sky-950/20"
        />
        <BucketSummaryCard
          title={t("bucket_history_title")}
          description={t("bucket_history_desc")}
          count={buckets.history.count}
          accentClass="border-stone-200/80 bg-stone-50/50 dark:bg-stone-900/30"
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          {t("page_summary", { unread: unreadOnPage, total: data.length })}
        </p>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="h-8 px-3 rounded-full">
            {data.length}
          </Badge>
          <Button onClick={onMarkAll} disabled={isPending} className="rounded-full">
            {t("mark_all_read")}
          </Button>
        </div>
      </div>

      <div className="flex flex-1 flex-wrap items-center gap-2 min-w-[200px]">
        <div className="relative flex min-w-[200px] flex-1 max-w-xl">
          <Search className="pointer-events-none absolute left-4 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className={cn(pillInputClass(), "pl-11 pr-4")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("search_placeholder")}
            onKeyDown={(e) => {
              if (e.key === "Enter") pushQuery({ search });
            }}
          />
        </div>
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetTrigger asChild>
            <Button
              type="button"
              variant="outline"
              className="gap-2 rounded-full border-foreground/90 bg-white px-5 hover:bg-stone-50"
            >
              <Filter className="h-4 w-4" />
              {t("filter")}
            </Button>
          </SheetTrigger>
          <SheetContent
            side="right"
            showCloseButton={false}
            className="w-full gap-0 border-l border-stone-200 bg-[#FAFAF8] p-0 sm:max-w-md"
          >
            <SheetHeader className="flex flex-row items-start justify-between border-b border-stone-100 px-6 py-5 text-left">
              <SheetTitle className="font-serif text-2xl font-semibold tracking-tight text-foreground">
                {t("sheet_title")}
              </SheetTitle>
              <button
                type="button"
                onClick={() => setSheetOpen(false)}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-black text-white hover:bg-stone-800"
                aria-label={t("sheet_close")}
              >
                <span className="text-lg leading-none">×</span>
              </button>
            </SheetHeader>

            <div className="flex flex-col gap-5 px-6 py-6">
              <div className="space-y-2">
                <Label className="text-sm font-medium">{t("priority")}</Label>
                <Select value={draftPriority || "__all__"} onValueChange={(v) => setDraftPriority(v === "__all__" ? "" : v)}>
                  <SelectTrigger className={cn(pillInputClass(), "flex !h-11 items-center justify-between")}>
                    <SelectValue placeholder={t("priority_all")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__all__">{t("priority_all")}</SelectItem>
                    <SelectItem value="CRITICAL">{t("priority_critical")}</SelectItem>
                    <SelectItem value="IMPORTANT">{t("priority_important")}</SelectItem>
                    <SelectItem value="NORMAL">{t("priority_normal")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">{t("read_state")}</Label>
                <Select value={draftRead || "__all__"} onValueChange={(v) => setDraftRead(v === "__all__" ? "" : v)}>
                  <SelectTrigger className={cn(pillInputClass(), "flex !h-11 items-center justify-between")}>
                    <SelectValue placeholder={t("read_all")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__all__">{t("read_all")}</SelectItem>
                    <SelectItem value="0">{t("read_unread")}</SelectItem>
                    <SelectItem value="1">{t("read_read")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">{t("type")}</Label>
                <Select value={draftType || "__all__"} onValueChange={(v) => setDraftType(v === "__all__" ? "" : v)}>
                  <SelectTrigger className={cn(pillInputClass(), "flex !h-11 items-center justify-between")}>
                    <SelectValue placeholder={t("type_all")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__all__">{t("type_all")}</SelectItem>
                    {NOTIFICATION_CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {t(`categories.${cat}`)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="mt-auto border-t border-stone-100 px-6 py-4 bg-[#FAFAF8]">
              <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-full"
                  onClick={() => {
                    setDraftPriority("");
                    setDraftRead("");
                    setDraftType("");
                    pushQuery({ search: "", type: "", priority: "", is_read: "" });
                    setSearch("");
                    setSheetOpen(false);
                  }}
                >
                  {t("reset")}
                </Button>
                <Button
                  type="button"
                  className="rounded-full"
                  onClick={() => {
                    pushQuery({ priority: draftPriority, is_read: draftRead, type: draftType });
                    setSheetOpen(false);
                  }}
                >
                  {t("apply_filters")}
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <div className="space-y-3">
        {data.length === 0 && (
          <Card className="border-dashed">
            <CardContent className="py-10 text-center text-sm text-muted-foreground">
              {t("empty_state")}
            </CardContent>
          </Card>
        )}
        {data.map((item) => {
          const href = notificationEntityHref(item.entity_type, item.entity_id);
          const pr = item.priority ?? "NORMAL";
          return (
            <Card
              key={String(item.id)}
              className={cn(
                "transition-colors",
                item.is_read ? "opacity-80" : "border-amber-200 bg-amber-50/30 dark:bg-amber-950/10"
              )}
            >
              <CardHeader className="pb-1">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    {priorityIcon(pr)}
                    <div>
                      <CardTitle className="text-base">{item.title}</CardTitle>
                      <p className="text-sm text-muted-foreground leading-relaxed mt-1">{item.message}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2 sm:flex-row sm:items-center">
                    <Badge variant={item.is_read ? "outline" : "default"}>
                      {item.is_read ? t("read_badge") : t("unread_badge")}
                    </Badge>
                    <Badge variant="secondary">
                      {isNotificationCategory(item.type) ? t(`categories.${item.type}`) : item.type}
                    </Badge>
                    <Badge variant="outline" className="font-normal">
                      {pr === "CRITICAL" || pr === "IMPORTANT" || pr === "NORMAL" ? t(`priorities.${pr}`) : pr}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-1 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs text-muted-foreground font-medium">
                  {item.created_at ? formatDistanceToNow(new Date(item.created_at), { addSuffix: true, locale: fr }) : "-"}
                </p>
                <div className="flex flex-wrap gap-2 justify-end">
                  {href && (
                    <Button size="sm" variant="secondary" className="rounded-full" asChild>
                      <Link href={href}>{t("cta_view")}</Link>
                    </Button>
                  )}
                  {!item.is_read && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="rounded-full"
                      onClick={() =>
                        startTransition(async () => {
                          const res = await markNotificationReadAction(item.id);
                          if (!res.isOk) {
                            toast.error(res.errorMessage || "Impossible");
                            return;
                          }
                          router.refresh();
                        })
                      }
                    >
                      {t("cta_resolve")}
                    </Button>
                  )}
                  <NotificationDeleteButton
                    id={item.id}
                    deleteTitle={deleteConfirmTitle}
                    deleteDescription={deleteConfirmDescription}
                  />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="flex items-center justify-end gap-2">
        <Button
          variant="outline"
          disabled={page <= 1}
          onClick={() => pushQuery({ page: String(Math.max(1, page - 1)) })}
        >
          {t("prev")}
        </Button>
        <span className="text-sm text-muted-foreground">
          {t("page_of", { page, total: totalPages })}
        </span>
        <Button
          variant="outline"
          disabled={page >= totalPages}
          onClick={() => pushQuery({ page: String(Math.min(totalPages, page + 1)) })}
        >
          {t("next")}
        </Button>
      </div>
    </div>
  );
}

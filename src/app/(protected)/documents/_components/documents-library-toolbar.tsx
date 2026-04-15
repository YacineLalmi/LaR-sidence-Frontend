"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ListItem } from "@/schemas/global.schema";
import { cn } from "@/lib/utils";
import { Filter, Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

const DOC_TYPE_OPTIONS: { value: string; labelKey: string }[] = [
  { value: "pdf", labelKey: "pdf" },
  { value: "doc", labelKey: "doc" },
  { value: "docx", labelKey: "docx" },
  { value: "xls", labelKey: "xls" },
  { value: "xlsx", labelKey: "xlsx" },
  { value: "jpg", labelKey: "jpg" },
  { value: "jpeg", labelKey: "jpeg" },
  { value: "png", labelKey: "png" },
  { value: "gif", labelKey: "gif" },
  { value: "svg", labelKey: "svg" },
];

function pillInputClass(disabled?: boolean) {
  return cn(
    "h-11 w-full rounded-full border border-foreground/90 bg-white px-4 text-sm shadow-none",
    "placeholder:text-muted-foreground/70 focus-visible:ring-1 focus-visible:ring-foreground",
    disabled && "opacity-60"
  );
}

type ToolbarProps = {
  agents: ListItem[];
};

export function DocumentsLibraryToolbar({ agents }: ToolbarProps) {
  const t = useTranslations("documents");
  const tFilter = useTranslations("documents.filter_sheet");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [searchDraft, setSearchDraft] = useState(() => searchParams.get("search") ?? "");
  const searchDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setSearchDraft(searchParams.get("search") ?? "");
  }, [searchParams]);

  const pushQuery = useCallback(
    (mutate: (p: URLSearchParams) => void) => {
      const p = new URLSearchParams(searchParams.toString());
      mutate(p);
      p.delete("page");
      router.push(`${pathname}?${p.toString()}`);
    },
    [pathname, router, searchParams]
  );

  const scheduleSearchCommit = useCallback(
    (value: string) => {
      if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
      searchDebounceRef.current = setTimeout(() => {
        pushQuery((p) => {
          const v = value.trim();
          if (v) p.set("search", v);
          else p.delete("search");
        });
      }, 380);
    },
    [pushQuery]
  );

  const onSearchChange = (value: string) => {
    setSearchDraft(value);
    scheduleSearchCommit(value);
  };

  const [sheetOpen, setSheetOpen] = useState(false);
  const [docName, setDocName] = useState("");
  const [agentId, setAgentId] = useState<string>("");
  const [onDay, setOnDay] = useState("");
  const [docType, setDocType] = useState<string>("");

  useEffect(() => {
    if (!sheetOpen) return;
    setDocName(searchParams.get("search") ?? "");
    setAgentId(searchParams.get("uploaded_by") ?? "");
    setOnDay(searchParams.get("on_day") ?? "");
    setDocType(searchParams.get("type") ?? "");
  }, [sheetOpen, searchParams]);

  const applyFilters = () => {
    pushQuery((p) => {
      const name = docName.trim();
      if (name) p.set("search", name);
      else p.delete("search");

      if (agentId) p.set("uploaded_by", agentId);
      else p.delete("uploaded_by");

      if (onDay) p.set("on_day", onDay);
      else p.delete("on_day");

      if (docType) p.set("type", docType);
      else p.delete("type");
    });
    setSearchDraft(docName.trim());
    setSheetOpen(false);
  };

  const resetFilters = () => {
    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    setSearchDraft("");
    setDocName("");
    setAgentId("");
    setOnDay("");
    setDocType("");
    setSheetOpen(false);
    router.replace(pathname);
  };

  return (
    <div className="flex flex-1 flex-wrap items-center gap-2 min-w-[200px]">
      <div className="relative flex min-w-[200px] flex-1 max-w-xl">
        <Search className="pointer-events-none absolute left-4 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          value={searchDraft}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={t("search_placeholder_wide")}
          className={cn(pillInputClass(), "pl-11 pr-4")}
          aria-label={t("search_placeholder_wide")}
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
            {t("filters")}
          </Button>
        </SheetTrigger>
        <SheetContent
          side="right"
          showCloseButton={false}
          className="w-full gap-0 border-l border-stone-200 bg-[#FAFAF8] p-0 sm:max-w-md"
        >
          <SheetHeader className="flex flex-row items-start justify-between border-b border-stone-100 px-6 py-5 text-left">
            <SheetTitle className="font-serif text-2xl font-semibold tracking-tight text-foreground">
              {t("filters")}
            </SheetTitle>
            <button
              type="button"
              onClick={() => setSheetOpen(false)}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-black text-white hover:bg-stone-800"
              aria-label={tFilter("close")}
            >
              <span className="text-lg leading-none">×</span>
            </button>
          </SheetHeader>

          <div className="flex flex-col gap-5 px-6 py-6">
            <div className="space-y-2">
              <Label htmlFor="filter-doc-name" className="text-sm font-medium">
                {tFilter("document_name")}
              </Label>
              <Input
                id="filter-doc-name"
                value={docName}
                onChange={(e) => setDocName(e.target.value)}
                className={pillInputClass()}
                placeholder={tFilter("document_name_placeholder")}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">{tFilter("agent_name")}</Label>
              <Select value={agentId || "__none__"} onValueChange={(v) => setAgentId(v === "__none__" ? "" : v)}>
                <SelectTrigger className={cn(pillInputClass(), "flex !h-11 items-center justify-between")}>
                  <SelectValue placeholder={tFilter("select_option")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__none__">{tFilter("select_option")}</SelectItem>
                  {agents.map((a) => (
                    <SelectItem key={a.id} value={a.id}>
                      {a.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="filter-on-day" className="text-sm font-medium">
                {tFilter("date_label")}
              </Label>
              <Input
                id="filter-on-day"
                type="date"
                value={onDay}
                onChange={(e) => setOnDay(e.target.value)}
                className={cn(pillInputClass(), "[color-scheme:light]")}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">{tFilter("document_type")}</Label>
              <Select value={docType || "__none__"} onValueChange={(v) => setDocType(v === "__none__" ? "" : v)}>
                <SelectTrigger className={cn(pillInputClass(), "flex !h-11 items-center justify-between")}>
                  <SelectValue placeholder={tFilter("select_option")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__none__">{tFilter("select_option")}</SelectItem>
                  {DOC_TYPE_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {tFilter(`types.${opt.labelKey}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-auto flex flex-col gap-3 border-t border-stone-100 px-6 py-5">
            <Button
              type="button"
              variant="outline"
              onClick={resetFilters}
              className="h-11 w-full rounded-full border-foreground/90 bg-white text-foreground hover:bg-stone-100"
            >
              {tFilter("reset")}
            </Button>
            <Button
              type="button"
              onClick={applyFilters}
              className="h-12 w-full rounded-full bg-black text-base font-medium text-white hover:bg-stone-900"
            >
              {tFilter("apply")}
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

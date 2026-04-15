"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { ListItem } from "@/schemas/global.schema";
import { StatisticsFilters, type StatisticsSection } from "@/schemas/statistics/statistics.schema";
import { useTranslations } from "next-intl";

import {
  statisticsFilterActions,
  statisticsFilterLabel,
  statisticsFiltersWidth,
  statisticsSelectTriggerSm,
} from "./statistics-layout";

const ALL = "__all__";

export type StatisticsFilterSection = Exclude<StatisticsSection, "summary">;

type Props = {
  section: StatisticsFilterSection;
  filters: StatisticsFilters;
  setFilters: React.Dispatch<React.SetStateAction<StatisticsFilters>>;
  wilayas: ListItem[];
  communes: ListItem[];
  bienTypes: ListItem[];
  agents: ListItem[];
  wilayaId: string | undefined;
  onGranularityChange: (value: StatisticsFilters["granularity"]) => void;
  onApply: () => void;
  onReset: () => void;
};

export function StatisticsFiltersPanel({
  section,
  filters,
  setFilters,
  wilayas,
  communes,
  bienTypes,
  agents,
  wilayaId,
  onGranularityChange,
  onApply,
  onReset,
}: Props) {
  const t = useTranslations("statistics");
  const showExclusivity = section === "biens" || section === "billing";

  return (
    <aside
      className={cn(
        "space-y-4 rounded-[28px] border border-black/5 bg-white p-6 shadow-sm",
        statisticsFiltersWidth
      )}
    >
      <p className="text-base font-semibold leading-none">{t("filters.title")}</p>

      <div className="space-y-4">
        <div className="grid gap-2">
          <Label className={statisticsFilterLabel}>{t("filters.period")}</Label>
          <Select
            value={filters.granularity ?? "month"}
            onValueChange={(v) => onGranularityChange(v as StatisticsFilters["granularity"])}
          >
            <SelectTrigger className={statisticsSelectTriggerSm}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">{t("filters.granularityOptions.day")}</SelectItem>
              <SelectItem value="week">{t("filters.granularityOptions.week")}</SelectItem>
              <SelectItem value="month">{t("filters.granularityOptions.month")}</SelectItem>
              <SelectItem value="quarter">{t("filters.granularityOptions.quarter")}</SelectItem>
              <SelectItem value="year">{t("filters.granularityOptions.year")}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-2">
          <Label className={statisticsFilterLabel}>{t("filters.propertyType")}</Label>
          <Select
            value={filters.bien_type_ids?.[0] ?? ALL}
            onValueChange={(v) =>
              setFilters((f) => ({
                ...f,
                bien_type_ids: v === ALL ? undefined : [v],
              }))
            }
          >
            <SelectTrigger className={statisticsSelectTriggerSm}>
              <SelectValue placeholder={t("filters.all")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>{t("filters.all")}</SelectItem>
              {bienTypes.map((bt) => (
                <SelectItem key={bt.id} value={bt.id}>
                  {bt.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-2">
          <Label className={statisticsFilterLabel}>{t("filters.wilaya")}</Label>
          <Select
            value={filters.wilaya_ids?.[0] ?? ALL}
            onValueChange={(v) =>
              setFilters((f) => ({
                ...f,
                wilaya_ids: v === ALL ? undefined : [v],
                commune_ids: undefined,
              }))
            }
          >
            <SelectTrigger className={statisticsSelectTriggerSm}>
              <SelectValue placeholder={t("filters.all")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>{t("filters.all")}</SelectItem>
              {wilayas.map((w) => (
                <SelectItem key={w.id} value={w.id}>
                  {w.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-2">
          <Label className={statisticsFilterLabel}>{t("filters.commune")}</Label>
          <Select
            disabled={!wilayaId}
            value={filters.commune_ids?.[0] ?? ALL}
            onValueChange={(v) =>
              setFilters((f) => ({
                ...f,
                commune_ids: v === ALL ? undefined : [v],
              }))
            }
          >
            <SelectTrigger className={cn(statisticsSelectTriggerSm, "disabled:opacity-60")}>
              <SelectValue placeholder={t("filters.all")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>{t("filters.all")}</SelectItem>
              {communes.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {showExclusivity ? (
          <div className="grid gap-2">
            <Label className={statisticsFilterLabel}>{t("filters.exclusivity")}</Label>
            <Select
              value={filters.exclusivity === true ? "yes" : filters.exclusivity === false ? "no" : ALL}
              onValueChange={(v) =>
                setFilters((f) => ({
                  ...f,
                  exclusivity: v === ALL ? undefined : v === "yes",
                }))
              }
            >
              <SelectTrigger className={statisticsSelectTriggerSm}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL}>{t("filters.exclusivityAll")}</SelectItem>
                <SelectItem value="yes">{t("filters.exclusivityYes")}</SelectItem>
                <SelectItem value="no">{t("filters.exclusivityNo")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        ) : null}

        <div className="grid gap-2">
          <Label className={statisticsFilterLabel}>{t("filters.agent")}</Label>
          <Select
            value={filters.agent_ids?.[0] ?? ALL}
            onValueChange={(v) =>
              setFilters((f) => ({
                ...f,
                agent_ids: v === ALL ? undefined : [v],
              }))
            }
          >
            <SelectTrigger className={statisticsSelectTriggerSm}>
              <SelectValue placeholder={t("filters.all")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>{t("filters.all")}</SelectItem>
              {agents.map((a) => (
                <SelectItem key={a.id} value={a.id}>
                  {a.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className={statisticsFilterActions}>
        <Button
          type="button"
          variant="outline"
          className="h-[38px] min-w-[121px] flex-1 rounded-lg border-foreground bg-white text-sm font-medium"
          onClick={onReset}
        >
          {t("filters.cancel")}
        </Button>
        <Button
          type="button"
          className="h-[38px] min-w-[127px] flex-1 rounded-lg bg-black text-sm font-medium text-white hover:bg-black/90"
          onClick={onApply}
        >
          {t("filters.confirm")}
        </Button>
      </div>
    </aside>
  );
}

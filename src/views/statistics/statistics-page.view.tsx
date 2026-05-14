"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "@/i18n/navigation";
import { format, startOfMonth, startOfYear, subDays } from "date-fns";
import {
  ArrowLeft,
  Building2,
  Calendar,
  ChevronDown,
  Clock,
  Database,
  DollarSign,
  PieChart as PieChartNavIcon,
  Users,
} from "lucide-react";
import { toast } from "sonner";

import { getAgentListAction } from "@/actions/users/get-agents-list.action";
import { getBienTypesListAction } from "@/actions/biens/get-bien-types-list.action";
import { getCommuneByWilaya } from "@/actions/commune/get-commune-by-wilaya";
import { getWilayaListAction } from "@/actions/wilayas/get-wilaya-list.action";
import { exportStatisticsReportAction } from "@/actions/statistics/export-statistics-report.action";
import { fetchStatisticsSectionAction } from "@/actions/statistics/fetch-statistics-section.action";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";
import type { ListItem } from "@/schemas/global.schema";
import { StatisticsFilters, statisticsSectionSchema, type StatisticsSection } from "@/schemas/statistics/statistics.schema";
import { useTranslations } from "next-intl";

import { StatisticsFiltersPanel } from "./statistics-filters-panel";
import { statisticsPageMaxWidth } from "./statistics-layout";
import { StatisticsSectionPanels } from "./statistics-section-panels";
import type { BiensDistributionMode } from "./statistics-types";

const BIEN_DONUT_COLORS = ["#A8D4F0", "#B8E8C8", "#F5E6A8", "#D4C4F5", "#C4B5FD", "#F9C89A"];

const SECTION_NAV: {
  key: "biens" | "offers" | "clients" | "demands" | "agents" | "billing" | "operations";
  segment: Exclude<StatisticsSection, "summary">;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  { key: "biens", segment: "biens", icon: Building2 },
  { key: "offers", segment: "offers", icon: Database },
  { key: "clients", segment: "clients", icon: Users },
  { key: "demands", segment: "demands", icon: PieChartNavIcon },
  { key: "agents", segment: "agents", icon: Clock },
  { key: "billing", segment: "billing", icon: DollarSign },
  { key: "operations", segment: "operations", icon: Calendar },
];

function defaultFilters(): StatisticsFilters {
  const today = new Date();
  return {
    date_from: format(startOfYear(today), "yyyy-MM-dd"),
    date_to: format(today, "yyyy-MM-dd"),
    granularity: "year",
  };
}

function alignDatesForGranularity(
  granularity: StatisticsFilters["granularity"],
  previous: StatisticsFilters
): Pick<StatisticsFilters, "date_from" | "date_to"> {
  const today = new Date();
  const to = format(today, "yyyy-MM-dd");
  switch (granularity) {
    case "year":
      return { date_from: format(startOfYear(today), "yyyy-MM-dd"), date_to: to };
    case "month":
      return { date_from: format(startOfMonth(today), "yyyy-MM-dd"), date_to: to };
    case "week":
      return { date_from: format(subDays(today, 7), "yyyy-MM-dd"), date_to: to };
    case "day":
      return { date_from: to, date_to: to };
    case "quarter":
      return { date_from: format(subDays(today, 90), "yyyy-MM-dd"), date_to: to };
    default:
      return { date_from: previous.date_from, date_to: previous.date_to };
  }
}

function downloadBase64File(base64: string, filename: string, mimeType: string) {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  const blob = new Blob([bytes], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

type Props = {
  section: string;
};

export function StatisticsPageView({ section }: Props) {
  const t = useTranslations("statistics");
  const parsed = statisticsSectionSchema.safeParse(section);
  const activeSection = parsed.success && parsed.data !== "summary" ? parsed.data : "biens";

  const [filters, setFilters] = useState<StatisticsFilters>(defaultFilters);
  const [data, setData] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [biensView, setBiensView] = useState<BiensDistributionMode>("type");

  const [wilayas, setWilayas] = useState<ListItem[]>([]);
  const [communes, setCommunes] = useState<ListItem[]>([]);
  const [bienTypes, setBienTypes] = useState<ListItem[]>([]);
  const [agents, setAgents] = useState<ListItem[]>([]);

  useEffect(() => {
    getWilayaListAction().then(setWilayas).catch(() => setWilayas([]));
    getBienTypesListAction().then(setBienTypes).catch(() => setBienTypes([]));
    getAgentListAction("").then(setAgents).catch(() => setAgents([]));
  }, []);

  const wilayaId = filters.wilaya_ids?.[0];
  useEffect(() => {
    if (!wilayaId) {
      setCommunes([]);
      return;
    }
    getCommuneByWilaya(wilayaId).then(setCommunes).catch(() => setCommunes([]));
  }, [wilayaId]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const result = await fetchStatisticsSectionAction(activeSection, filters);
      if (!result.ok) {
        if (result.kind === "forbidden") {
          toast.error(t("errorForbidden"));
        } else if (result.kind === "unauthorized") {
          toast.error(t("errorUnauthorized"));
        } else {
          toast.error(result.message ?? t("error"));
        }
        setData(null);
        return;
      }
      setData(result.data);
    } catch {
      toast.error(t("error"));
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [activeSection, filters, t]);

  useEffect(() => {
    load();
  }, [load]);

  const onExport = async (format: "csv" | "xlsx" | "pdf") => {
    setExporting(true);
    try {
      const res = await exportStatisticsReportAction(activeSection, format, filters);
      if (!res.ok) {
        toast.error(res.message);
        return;
      }
      downloadBase64File(res.base64, res.filename, res.mimeType);
      toast.success("Téléchargement lancé");
    } finally {
      setExporting(false);
    }
  };

  const onGranularityChange = (value: StatisticsFilters["granularity"]) => {
    setFilters((f) => {
      const next = alignDatesForGranularity(value, f);
      return { ...f, granularity: value, ...next };
    });
  };

  const chartColors = useMemo(() => ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)"], []);

  return (
    <div className="-mx-5 bg-[#F9F9F7] px-5 pb-10 pt-6">
      <div className={cn("mx-auto space-y-8 px-0 sm:px-4 lg:px-[clamp(1rem,4vw,5rem)]", statisticsPageMaxWidth)}>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-3">
              <Button variant="ghost" size="icon" className="mt-1 h-[54px] w-[54px] shrink-0 rounded-full" asChild>
                <Link href={ROUTES.DASHBOARD} aria-label={t("backAria")}>
                  <ArrowLeft className="h-5 w-5" />
                </Link>
              </Button>
              <div>
                <h1 className="text-[1.375rem] font-semibold leading-tight tracking-tight text-foreground sm:text-2xl">
                  {t("title")}
                </h1>
                <p className="text-muted-foreground mt-1 text-sm">{t("subtitle")}</p>
              </div>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  type="button"
                  disabled={exporting}
                  className="h-10 min-w-[143px] shrink-0 gap-2 rounded-lg border border-black bg-black px-5 text-sm font-medium text-white hover:bg-black/90"
                >
                  {t("export.label")}
                  <ChevronDown className="h-4 w-4 opacity-80" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-[10rem]">
                <DropdownMenuItem onClick={() => onExport("csv")}>{t("export.csv")}</DropdownMenuItem>
                <DropdownMenuItem onClick={() => onExport("xlsx")}>{t("export.xlsx")}</DropdownMenuItem>
                <DropdownMenuItem onClick={() => onExport("pdf")}>{t("export.pdf")}</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <nav
            className="flex max-w-[960px] flex-wrap gap-2"
            aria-label={t("sectionsNavAria")}
          >
            {SECTION_NAV.map((item) => {
              const Icon = item.icon;
              const active = activeSection === item.segment;
              return (
                <Link
                  key={item.segment}
                  href={ROUTES.STATISTICS.SECTION(item.segment)}
                  className={cn(
                    "inline-flex h-9 items-center gap-2 rounded-full border px-3.5 text-sm font-medium transition-colors",
                    active
                      ? "border-black bg-black text-white shadow-sm"
                      : "border-border bg-white text-foreground hover:bg-white/90"
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0 opacity-90" />
                  {t(`nav.${item.key}` as "nav.biens")}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-8">
          <StatisticsFiltersPanel
            section={activeSection}
            filters={filters}
            setFilters={setFilters}
            wilayas={wilayas}
            communes={communes}
            bienTypes={bienTypes}
            agents={agents}
            wilayaId={wilayaId}
            onGranularityChange={onGranularityChange}
            onApply={load}
            onReset={() => setFilters(defaultFilters())}
          />

          <div className="min-w-0 flex-1 space-y-6">
            {loading ? (
              <p className="text-muted-foreground text-sm">{t("loading")}</p>
            ) : !data ? (
              <p className="text-muted-foreground text-sm">{t("empty")}</p>
            ) : (
              <StatisticsSectionPanels
                section={activeSection}
                data={data}
                chartColors={chartColors}
                donutColors={BIEN_DONUT_COLORS}
                biensView={biensView}
                onBiensViewChange={setBiensView}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

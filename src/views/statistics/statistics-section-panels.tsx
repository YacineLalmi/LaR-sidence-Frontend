"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart, XAxis, YAxis } from "recharts";

import { StatisticsProvenanceBars } from "./statistics-provenance-bars";
import { statisticsSelectTriggerSm } from "./statistics-layout";
import type { BiensDistributionMode } from "./statistics-types";

type Props = {
  section: string;
  data: Record<string, unknown>;
  chartColors: string[];
  donutColors: string[];
  biensView: BiensDistributionMode;
  onBiensViewChange: (m: BiensDistributionMode) => void;
};

export function StatisticsSectionPanels({
  section,
  data,
  chartColors,
  donutColors,
  biensView,
  onBiensViewChange,
}: Props) {
  if (section === "summary") {
    return <SummaryPanel data={data} chartColors={chartColors} />;
  }
  if (section === "biens") {
    return (
      <BiensPanel
        data={data}
        donutColors={donutColors}
        biensView={biensView}
        onBiensViewChange={onBiensViewChange}
      />
    );
  }
  if (section === "offers") {
    return <OffersPanel data={data} donutColors={donutColors} chartColors={chartColors} />;
  }
  if (section === "clients") {
    return <ClientsPanel data={data} chartColors={chartColors} />;
  }
  if (section === "demands") {
    return <DemandsPanel data={data} donutColors={donutColors} chartColors={chartColors} />;
  }
  if (section === "agents") {
    return <AgentsPanel data={data} chartColors={chartColors} />;
  }
  if (section === "billing") {
    return <BillingPanel data={data} chartColors={chartColors} />;
  }
  if (section === "operations") {
    return <OperationsPanel data={data} chartColors={chartColors} donutColors={donutColors} />;
  }

  return (
    <Card className="rounded-[28px] border-0 shadow-sm">
      <CardContent className="pt-6">
        <pre className="bg-muted max-h-[480px] overflow-auto rounded-xl p-4 text-xs">{JSON.stringify(data, null, 2)}</pre>
      </CardContent>
    </Card>
  );
}

function SummaryPanel({ data, chartColors }: { data: Record<string, unknown>; chartColors: string[] }) {
  const counts = data.counts as Record<string, number> | undefined;
  if (!counts) return null;
  const rows = Object.entries(counts).map(([k, v]) => ({ name: k, total: v }));
  const chartConfig = {
    total: { label: "Total", color: chartColors[0] ?? "var(--chart-1)" },
  } satisfies ChartConfig;
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card className="rounded-[28px] border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">Volumes (période)</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[280px]">
            <BarChart data={rows} accessibilityLayer>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="name" tickLine={false} tickMargin={8} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="total" fill="var(--color-total)" radius={4} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}

function BiensPanel({
  data,
  donutColors,
  biensView,
  onBiensViewChange,
}: {
  data: Record<string, unknown>;
  donutColors: string[];
  biensView: BiensDistributionMode;
  onBiensViewChange: (m: BiensDistributionMode) => void;
}) {
  const t = useTranslations("statistics");
  const byType = data.by_type as { labels?: string[]; values?: number[] } | undefined;
  const byStatus = data.by_status as { labels?: string[]; values?: number[] } | undefined;
  const byExclusivity = data.by_exclusivity as { exclusivity: boolean; count: number }[] | undefined;
  const byWilaya = data.by_wilaya as { label: string; count: number }[] | undefined;
  const portfolioEvolution = data.portfolio_evolution as
    | {
        labels?: string[];
        new_biens?: number[];
        sold?: number[];
        rented?: number[];
      }
    | undefined;
  const createdSeries = data.created_in_period as { labels?: string[]; values?: number[] } | undefined;

  const pieFromDistribution = (labels: string[] | undefined, values: number[] | undefined) =>
    (labels ?? []).map((label, i) => ({
      name: label,
      value: values?.[i] ?? 0,
    }));

  let pieData: { name: string; value: number }[] = [];
  if (biensView === "type") pieData = pieFromDistribution(byType?.labels, byType?.values);
  else if (biensView === "status") pieData = pieFromDistribution(byStatus?.labels, byStatus?.values);
  else if (biensView === "exclusivity") {
    pieData = (byExclusivity ?? []).map((row) => ({
      name: row.exclusivity ? t("chart.exclusiveYes") : t("chart.exclusiveNo"),
      value: row.count,
    }));
  }

  const total = pieData.reduce((s, x) => s + x.value, 0);
  const pieConfig = Object.fromEntries(
    pieData.map((row, i) => [`s${i}`, { label: row.name, color: donutColors[i % donutColors.length] }])
  ) satisfies ChartConfig;

  const wilayaRows = (byWilaya ?? []).map((w) => ({ label: w.label, count: w.count }));
  const wilayaCfg = { count: { label: t("chart.wilayaCount"), color: "#C8AB68" } } satisfies ChartConfig;

  const portfolioRows =
    portfolioEvolution?.labels?.map((label, i) => ({
      period: String(label),
      new: portfolioEvolution.new_biens?.[i] ?? 0,
      sold: portfolioEvolution.sold?.[i] ?? 0,
      rented: portfolioEvolution.rented?.[i] ?? 0,
    })) ?? [];
  const portfolioChartConfig = {
    new: { label: t("chart.portfolioNew"), color: "#3B82F6" },
    sold: { label: t("chart.portfolioSold"), color: "#EAB308" },
    rented: { label: t("chart.portfolioRented"), color: "#8B5CF6" },
  } satisfies ChartConfig;

  const creationsLine =
    createdSeries?.labels?.map((label, i) => ({
      period: String(label),
      count: createdSeries.values?.[i] ?? 0,
    })) ?? [];
  const creationsCfg = { count: { label: t("chart.creationsShort"), color: "var(--chart-1)" } } satisfies ChartConfig;

  let biensSubtitle = t("chart.biensSubtitleWilaya");
  switch (biensView) {
    case "type":
      biensSubtitle = t("chart.biensSubtitleType");
      break;
    case "status":
      biensSubtitle = t("chart.biensSubtitleStatus");
      break;
    case "exclusivity":
      biensSubtitle = t("chart.biensSubtitleExclusivity");
      break;
    default:
      break;
  }

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden rounded-[28px] border-0 bg-white shadow-sm">
        <CardHeader className="space-y-0 pb-4 pt-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0 flex-1 pr-2">
              <CardTitle className="text-lg font-semibold leading-tight">{t("chart.biensDonutTitle")}</CardTitle>
              <CardDescription className="text-muted-foreground mt-1.5 max-w-[28rem] text-sm leading-snug">
                {biensSubtitle}
              </CardDescription>
            </div>
            <Select value={biensView} onValueChange={(v) => onBiensViewChange(v as BiensDistributionMode)}>
              <SelectTrigger
                className={cn(
                  statisticsSelectTriggerSm,
                  "w-full min-w-[160px] shrink-0 sm:w-[200px] lg:ml-auto"
                )}
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent align="end">
                <SelectItem value="type">{t("chart.byType")}</SelectItem>
                <SelectItem value="status">{t("chart.byStatus")}</SelectItem>
                <SelectItem value="exclusivity">{t("chart.byExclusivity")}</SelectItem>
                <SelectItem value="wilaya">{t("chart.byWilaya")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {biensView === "wilaya" ? (
            <ChartContainer config={wilayaCfg} className="h-[min(420px,70vh)] w-full">
              <BarChart data={wilayaRows} layout="vertical" accessibilityLayer margin={{ left: 8, right: 16 }}>
                <CartesianGrid horizontal={false} />
                <XAxis type="number" tickLine={false} />
                <YAxis type="category" dataKey="label" width={100} tickLine={false} tickMargin={4} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="count" fill="var(--color-count)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ChartContainer>
          ) : (
            <div className="flex flex-col items-center gap-8 lg:flex-row lg:items-center lg:justify-center lg:gap-10">
              <ChartContainer
                config={pieConfig}
                className="mx-auto aspect-square h-[min(400px,88vw)] w-[min(400px,88vw)] max-w-[400px]"
              >
                <PieChart>
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius="52%"
                    outerRadius="78%"
                    paddingAngle={3}
                    stroke="#fff"
                    strokeWidth={2}
                  >
                    {pieData.map((_, i) => (
                      <Cell key={i} fill={donutColors[i % donutColors.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ChartContainer>

              <div className="flex w-full max-w-[400px] flex-col gap-3 lg:min-w-[240px]">
                {pieData.map((row, i) => (
                  <div key={row.name} className="flex items-center justify-between gap-6 text-sm">
                    <div className="flex min-w-0 items-center gap-2">
                      <span
                        className="h-3 w-3 shrink-0 rounded-full"
                        style={{ backgroundColor: donutColors[i % donutColors.length] }}
                      />
                      <span className="truncate font-medium">{row.name}</span>
                    </div>
                    <span className="text-muted-foreground tabular-nums">
                      {total ? `${((row.value / total) * 100).toFixed(1)}%` : "0%"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {portfolioRows.length > 0 ? (
        <Card className="rounded-[28px] border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">{t("chart.portfolioEvolution")}</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={portfolioChartConfig} className="h-[300px]">
              <LineChart data={portfolioRows} accessibilityLayer>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="period" tickLine={false} tickMargin={8} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend />
                <Line type="monotone" dataKey="new" stroke="var(--color-new)" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="sold" stroke="var(--color-sold)" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="rented" stroke="var(--color-rented)" strokeWidth={2} dot={false} />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
      ) : null}

      <Card className="rounded-[28px] border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">{t("chart.creationsTitle")}</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={creationsCfg} className="h-[280px]">
            <LineChart data={creationsLine} accessibilityLayer>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="period" tickLine={false} tickMargin={8} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line type="monotone" dataKey="count" stroke="var(--color-count)" strokeWidth={2} dot={false} />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}

function OffersPanel({
  data,
  donutColors,
  chartColors,
}: {
  data: Record<string, unknown>;
  donutColors: string[];
  chartColors: string[];
}) {
  const t = useTranslations("statistics");
  const countsByStatus = data.counts_by_status as { label: string; count: number }[] | undefined;
  const byClientSource = data.by_client_source as { label: string; count: number }[] | undefined;
  const series = data.series_by_period as { labels?: string[]; values?: number[] } | undefined;
  const conversion = data.conversion_rate_series as
    | { labels?: string[]; rates?: (number | null)[] }
    | undefined;
  const avgDays = data.avg_days_to_success_series as { labels?: string[]; values?: (number | null)[] } | undefined;

  const statusPie =
    countsByStatus?.map((r) => ({
      name: r.label,
      value: r.count,
    })) ?? [];
  const statusTotal = statusPie.reduce((s, x) => s + x.value, 0);
  const statusCfg = Object.fromEntries(
    statusPie.map((row, i) => [`s${i}`, { label: row.name, color: donutColors[i % donutColors.length] }])
  ) satisfies ChartConfig;

  const barRows =
    series?.labels?.map((l, i) => ({
      period: String(l),
      count: series.values?.[i] ?? 0,
    })) ?? [];
  const barCfg = { count: { label: t("chart.offersCreated"), color: chartColors[0] ?? "var(--chart-1)" } } satisfies ChartConfig;

  const convRows =
    conversion?.labels?.map((l, i) => ({
      period: String(l),
      rate: conversion.rates?.[i] ?? 0,
    })) ?? [];
  const convCfg = { rate: { label: t("chart.conversionRate"), color: "#C8AB68" } } satisfies ChartConfig;

  const delayRows =
    avgDays?.labels?.map((l, i) => ({
      period: String(l),
      days: avgDays.values?.[i] ?? 0,
    })) ?? [];
  const delayCfg = { days: { label: t("chart.avgDays"), color: chartColors[1] ?? "var(--chart-2)" } } satisfies ChartConfig;

  const provenanceRows = (byClientSource ?? []).map((r) => ({ label: r.label, count: r.count }));

  const hasStatusData = statusPie.length > 0 && statusTotal > 0;
  const hasBarData = barRows.length > 0;
  const hasConversionData = convRows.length > 0;
  const hasDelayData = delayRows.length > 0;
  const hasProvenanceData = provenanceRows.length > 0;

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="rounded-[28px] border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">{t("chart.offersByStatus")}</CardTitle>
          </CardHeader>
          <CardContent>
            {!hasStatusData ? (
              <p className="text-muted-foreground py-8 text-center text-sm">{t("chart.emptyOffersChart")}</p>
            ) : (
            <div className="flex flex-col items-center gap-6 md:flex-row md:items-start">
              <ChartContainer config={statusCfg} className="mx-auto aspect-square h-[260px] min-h-[200px] w-[260px]">
                <PieChart>
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Pie
                    data={statusPie}
                    dataKey="value"
                    nameKey="name"
                    innerRadius="50%"
                    outerRadius="75%"
                    paddingAngle={2}
                    stroke="#fff"
                    strokeWidth={2}
                  >
                    {statusPie.map((_, i) => (
                      <Cell key={i} fill={donutColors[i % donutColors.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ChartContainer>
              <div className="flex min-w-0 flex-1 flex-col gap-2 text-sm">
                {statusPie.map((row, i) => (
                  <div key={row.name} className="flex justify-between gap-4">
                    <span className="flex items-center gap-2 truncate">
                      <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: donutColors[i % donutColors.length] }} />
                      {row.name}
                    </span>
                    <span className="text-muted-foreground tabular-nums">
                      {statusTotal ? `${((row.value / statusTotal) * 100).toFixed(1)}%` : "0%"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            )}
          </CardContent>
        </Card>

        <Card className="rounded-[28px] border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">{t("chart.provenanceOffers")}</CardTitle>
          </CardHeader>
          <CardContent>
            {!hasProvenanceData ? (
              <p className="text-muted-foreground py-6 text-center text-sm">{t("chart.emptyOffersChart")}</p>
            ) : (
              <StatisticsProvenanceBars rows={provenanceRows} />
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-[28px] border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">{t("chart.offersCreated")}</CardTitle>
        </CardHeader>
        <CardContent>
          {!hasBarData ? (
            <p className="text-muted-foreground py-12 text-center text-sm">{t("chart.emptyOffersChart")}</p>
          ) : (
          <ChartContainer config={barCfg} className="h-[280px] min-h-[200px]">
            <BarChart data={barRows} accessibilityLayer>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="period" tickLine={false} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="count" fill="var(--color-count)" radius={4} />
            </BarChart>
          </ChartContainer>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="rounded-[28px] border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">{t("chart.conversionRateTitle")}</CardTitle>
          </CardHeader>
          <CardContent>
            {!hasConversionData ? (
              <p className="text-muted-foreground py-10 text-center text-sm">{t("chart.emptyOffersChart")}</p>
            ) : (
            <ChartContainer config={convCfg} className="h-[240px] min-h-[180px]">
              <LineChart data={convRows} accessibilityLayer>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="period" tickLine={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line type="monotone" dataKey="rate" stroke="var(--color-rate)" strokeWidth={2} dot={false} />
              </LineChart>
            </ChartContainer>
            )}
          </CardContent>
        </Card>
        <Card className="rounded-[28px] border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">{t("chart.avgDaysSignature")}</CardTitle>
          </CardHeader>
          <CardContent>
            {!hasDelayData ? (
              <p className="text-muted-foreground py-10 text-center text-sm">{t("chart.emptyOffersChart")}</p>
            ) : (
            <ChartContainer config={delayCfg} className="h-[240px] min-h-[180px]">
              <LineChart data={delayRows} accessibilityLayer>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="period" tickLine={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line type="monotone" dataKey="days" stroke="var(--color-days)" strokeWidth={2} dot={false} />
              </LineChart>
            </ChartContainer>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function ClientsPanel({ data, chartColors }: { data: Record<string, unknown>; chartColors: string[] }) {
  const t = useTranslations("statistics");
  const s = data.new_clients_series as { labels?: string[]; values?: number[] } | undefined;
  const bySource = data.by_source as { label: string; count: number }[] | undefined;
  const rows =
    s?.labels?.map((l, i) => ({
      period: String(l),
      count: s.values?.[i] ?? 0,
    })) ?? [];
  const cfg = { count: { label: t("chart.newClients"), color: chartColors[0] ?? "var(--chart-1)" } } satisfies ChartConfig;
  const provRows = (bySource ?? []).map((r) => ({ label: r.label, count: r.count }));

  return (
    <div className="space-y-6">
      <Card className="rounded-[28px] border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">{t("chart.newClients")}</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={cfg} className="h-[300px]">
            <LineChart data={rows} accessibilityLayer>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="period" tickLine={false} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line type="monotone" dataKey="count" stroke="var(--color-count)" strokeWidth={2} dot={false} />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>
      <Card className="rounded-[28px] border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">{t("chart.clientProvenance")}</CardTitle>
        </CardHeader>
        <CardContent>
          <StatisticsProvenanceBars rows={provRows} />
        </CardContent>
      </Card>
    </div>
  );
}

function DemandsPanel({
  data,
  donutColors,
  chartColors,
}: {
  data: Record<string, unknown>;
  donutColors: string[];
  chartColors: string[];
}) {
  const t = useTranslations("statistics");
  const byStatus = data.by_status as { label: string; count: number }[] | undefined;
  const bySource = data.by_source as { label: string; count: number }[] | undefined;
  const series = data.series as { labels?: string[]; values?: number[] } | undefined;
  const matching = data.matching_breakdown as { labels: string[]; values: number[] } | undefined;

  const statusPie =
    byStatus?.map((r) => ({
      name: r.label,
      value: r.count,
    })) ?? [];
  const stTotal = statusPie.reduce((s, x) => s + x.value, 0);
  const stCfg = Object.fromEntries(
    statusPie.map((row, i) => [`s${i}`, { label: row.name, color: donutColors[i % donutColors.length] }])
  ) satisfies ChartConfig;

  const matchPie =
    matching?.labels?.map((label, i) => ({
      name: label,
      value: matching.values?.[i] ?? 0,
    })) ?? [];
  const matchTotal = matchPie.reduce((s, x) => s + x.value, 0);
  const matchCfg = Object.fromEntries(
    matchPie.map((row, i) => [`m${i}`, { label: row.name, color: chartColors[i % chartColors.length] }])
  ) satisfies ChartConfig;

  const barRows =
    series?.labels?.map((l, i) => ({
      period: String(l),
      count: series.values?.[i] ?? 0,
    })) ?? [];
  const barCfg = { count: { label: t("chart.demands"), color: chartColors[0] ?? "var(--chart-1)" } } satisfies ChartConfig;
  const provRows = (bySource ?? []).map((r) => ({ label: r.label, count: r.count }));

  const hasStatusData = statusPie.length > 0 && stTotal > 0;
  const hasMatchData = matchTotal > 0;
  const hasProvData = provRows.some((r) => r.count > 0);
  const hasBarData = barRows.some((r) => (r.count ?? 0) > 0);

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="rounded-[28px] border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">{t("chart.demandsByStatus")}</CardTitle>
          </CardHeader>
          <CardContent>
            {!hasStatusData ? (
              <p className="text-muted-foreground py-8 text-center text-sm">{t("chart.emptyDemandsChart")}</p>
            ) : (
            <div className="flex flex-col items-center gap-6 md:flex-row">
              <ChartContainer config={stCfg} className="mx-auto aspect-square h-[240px] min-h-[200px] w-[240px]">
                <PieChart>
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Pie
                    data={statusPie}
                    dataKey="value"
                    nameKey="name"
                    innerRadius="50%"
                    outerRadius="75%"
                    paddingAngle={2}
                    stroke="#fff"
                    strokeWidth={2}
                  >
                    {statusPie.map((_, i) => (
                      <Cell key={i} fill={donutColors[i % donutColors.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ChartContainer>
              <div className="flex min-w-0 flex-1 flex-col gap-2 text-sm">
                {statusPie.map((row, i) => (
                  <div key={row.name} className="flex justify-between gap-4">
                    <span className="flex items-center gap-2 truncate">
                      <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: donutColors[i % donutColors.length] }} />
                      {row.name}
                    </span>
                    <span className="text-muted-foreground tabular-nums">
                      {stTotal ? `${((row.value / stTotal) * 100).toFixed(1)}%` : "0%"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            )}
          </CardContent>
        </Card>

        <Card className="rounded-[28px] border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">{t("chart.demandMatching")}</CardTitle>
          </CardHeader>
          <CardContent>
            {!hasMatchData ? (
              <p className="text-muted-foreground py-8 text-center text-sm">{t("chart.emptyDemandsChart")}</p>
            ) : (
            <div className="flex flex-col items-center gap-6 md:flex-row">
              <ChartContainer config={matchCfg} className="mx-auto aspect-square h-[220px] min-h-[180px] w-[220px]">
                <PieChart>
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Pie
                    data={matchPie}
                    dataKey="value"
                    nameKey="name"
                    innerRadius="48%"
                    outerRadius="72%"
                    paddingAngle={2}
                    stroke="#fff"
                    strokeWidth={2}
                  >
                    {matchPie.map((_, i) => (
                      <Cell key={i} fill={chartColors[i % chartColors.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ChartContainer>
              <div className="flex min-w-0 flex-1 flex-col gap-2 text-sm">
                {matchPie.map((row, i) => (
                  <div key={row.name} className="flex justify-between gap-4">
                    <span className="truncate">{row.name}</span>
                    <span className="text-muted-foreground tabular-nums">
                      {matchTotal ? `${((row.value / matchTotal) * 100).toFixed(1)}%` : "0%"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-[28px] border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">{t("chart.demandProvenance")}</CardTitle>
        </CardHeader>
        <CardContent>
          {!hasProvData ? (
            <p className="text-muted-foreground py-6 text-center text-sm">{t("chart.emptyDemandsChart")}</p>
          ) : (
            <StatisticsProvenanceBars rows={provRows} />
          )}
        </CardContent>
      </Card>

      <Card className="rounded-[28px] border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">{t("chart.demandsSeries")}</CardTitle>
        </CardHeader>
        <CardContent>
          {!hasBarData ? (
            <p className="text-muted-foreground py-12 text-center text-sm">{t("chart.emptyDemandsChart")}</p>
          ) : (
          <ChartContainer config={barCfg} className="h-[300px] min-h-[200px]">
            <BarChart data={barRows} accessibilityLayer>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="period" tickLine={false} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="count" fill="var(--color-count)" radius={4} />
            </BarChart>
          </ChartContainer>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function AgentsPanel({ data, chartColors }: { data: Record<string, unknown>; chartColors: string[] }) {
  const t = useTranslations("statistics");
  const rev = data.revenue_by_agent as { label?: string; amount_ttc?: number }[] | undefined;
  const rows = rev?.map((r) => ({ name: r.label ?? "—", amount: r.amount_ttc ?? 0 })) ?? [];
  const cfg = { amount: { label: t("chart.caTtc"), color: chartColors[0] ?? "var(--chart-1)" } } satisfies ChartConfig;
  return (
    <Card className="rounded-[28px] border-0 shadow-sm">
      <CardHeader>
        <CardTitle className="text-base">{t("chart.revenueByAgent")}</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={cfg} className="h-[320px]">
          <BarChart data={rows} accessibilityLayer layout="vertical">
            <CartesianGrid horizontal={false} />
            <XAxis type="number" />
            <YAxis type="category" dataKey="name" width={120} tickLine={false} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="amount" fill="var(--color-amount)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

function BillingPanel({ data, chartColors }: { data: Record<string, unknown>; chartColors: string[] }) {
  const t = useTranslations("statistics");
  const vl = data.amounts_series_ventes_locations as
    | { labels?: string[]; ventes_ttc?: number[]; locations_ttc?: number[] }
    | undefined;
  const legacy = data.amounts_series as { labels?: string[]; amount_ttc?: number[] } | undefined;

  const dualRows =
    vl?.labels?.map((l, i) => ({
      period: String(l),
      ventes: vl.ventes_ttc?.[i] ?? 0,
      locations: vl.locations_ttc?.[i] ?? 0,
    })) ?? [];
  const dualCfg = {
    ventes: { label: t("chart.billingVentes"), color: "#3B82F6" },
    locations: { label: t("chart.billingLocations"), color: "#C8AB68" },
  } satisfies ChartConfig;

  const singleRows =
    legacy?.labels?.map((l, i) => ({
      period: String(l),
      ttc: legacy.amount_ttc?.[i] ?? 0,
    })) ?? [];
  const singleCfg = { ttc: { label: t("chart.amountsTtc"), color: chartColors[0] ?? "var(--chart-1)" } } satisfies ChartConfig;

  return (
    <div className="space-y-6">
      {dualRows.length > 0 ? (
        <Card className="rounded-[28px] border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">{t("chart.billingVentesLocations")}</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={dualCfg} className="h-[320px]">
              <LineChart data={dualRows} accessibilityLayer>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="period" tickLine={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend />
                <Line type="monotone" dataKey="ventes" stroke="var(--color-ventes)" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="locations" stroke="var(--color-locations)" strokeWidth={2} dot={false} />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
      ) : null}
      {singleRows.length > 0 ? (
        <Card className="rounded-[28px] border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">{t("chart.amountsTtc")}</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={singleCfg} className="h-[280px]">
              <LineChart data={singleRows} accessibilityLayer>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="period" tickLine={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line type="monotone" dataKey="ttc" stroke="var(--color-ttc)" strokeWidth={2} dot={false} />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}

function OperationsPanel({
  data,
  chartColors,
  donutColors,
}: {
  data: Record<string, unknown>;
  chartColors: string[];
  donutColors: string[];
}) {
  const t = useTranslations("statistics");
  const ap = data.appointments_by_agent as { label?: string; count?: number }[] | undefined;
  const etat = data.etat_des_lieux as { labels?: string[]; values?: number[] } | undefined;
  const visits = data.property_visits as { label?: string; count?: number }[] | undefined;

  const rows = ap?.map((r) => ({ name: r.label ?? "—", count: r.count ?? 0 })) ?? [];
  const cfg = { count: { label: t("chart.rdv"), color: chartColors[0] ?? "var(--chart-1)" } } satisfies ChartConfig;

  const etatPie =
    etat?.labels?.map((label, i) => ({
      name: label,
      value: etat.values?.[i] ?? 0,
    })) ?? [];
  const etatTotal = etatPie.reduce((s, x) => s + x.value, 0);
  const etatCfg = Object.fromEntries(
    etatPie.map((row, i) => [`e${i}`, { label: row.name, color: donutColors[i % donutColors.length] }])
  ) satisfies ChartConfig;

  const visitRows = visits?.map((r) => ({ name: r.label ?? "—", count: r.count ?? 0 })) ?? [];
  const visitCfg = { count: { label: t("chart.visits"), color: chartColors[1] ?? "var(--chart-2)" } } satisfies ChartConfig;

  return (
    <div className="space-y-6">
      {etatPie.length > 0 ? (
        <Card className="rounded-[28px] border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">{t("chart.etatDesLieux")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center gap-6 md:flex-row md:items-start">
              <ChartContainer config={etatCfg} className="mx-auto aspect-square h-[260px] w-[260px]">
                <PieChart>
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Pie
                    data={etatPie}
                    dataKey="value"
                    nameKey="name"
                    innerRadius="50%"
                    outerRadius="75%"
                    paddingAngle={2}
                    stroke="#fff"
                    strokeWidth={2}
                  >
                    {etatPie.map((_, i) => (
                      <Cell key={i} fill={donutColors[i % donutColors.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ChartContainer>
              <div className="flex min-w-0 flex-1 flex-col gap-2 text-sm">
                {etatPie.map((row, i) => (
                  <div key={row.name} className="flex justify-between gap-4">
                    <span className="flex items-center gap-2 truncate">
                      <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: donutColors[i % donutColors.length] }} />
                      {row.name}
                    </span>
                    <span className="text-muted-foreground tabular-nums">
                      {etatTotal ? `${((row.value / etatTotal) * 100).toFixed(1)}%` : "0%"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      ) : null}

      <Card className="rounded-[28px] border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">{t("chart.appointmentsByAgent")}</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={cfg} className="h-[300px]">
            <BarChart data={rows} accessibilityLayer>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="name" tickLine={false} interval={0} angle={-20} height={64} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="count" fill="var(--color-count)" radius={4} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {visitRows.length > 0 ? (
        <Card className="rounded-[28px] border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">{t("chart.visitsByAgent")}</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={visitCfg} className="h-[280px]">
              <BarChart data={visitRows} accessibilityLayer layout="vertical">
                <CartesianGrid horizontal={false} />
                <XAxis type="number" />
                <YAxis type="category" dataKey="name" width={120} tickLine={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="count" fill="var(--color-count)" radius={4} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}

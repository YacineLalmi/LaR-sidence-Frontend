"use client";

import * as React from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { BienDistribution } from "@/schemas/dashboard/bien-distribution.schema";
import { useLocale } from "next-intl";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { OfferFilterStatsForm } from "@/schemas/offers/offer-filter-stats-form.schema";
import getOfferStatsActions from "@/actions/statistics/get-offer-stats.action";

const COLORS = ["#A7F3D0", "#FDE68A", "#BFDBFE", "#DDD6FE", "#FCA5A5", "#F9A8D4"];
const BAR_COLOR = "#6366F1"; // Indigo color for bar chart

const TITLE_MAP: Record<string, string> = {
  type: "Nombre des offers",
  status: "Nombre des offers",
  creation: "Nombre des offers",
};

const DESCRIPTION_MAP: Record<string, string> = {
  type: "Typologie des offers",
  status: "État des offers",
  creation: "Date de création",
};

export function OfferStatsChart() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const locale = useLocale() as "fr" | "en" | "ar";

  // 1. Retrieve the 'groupBy' and 'period' values from the URL query params
  const currentGroupBy = searchParams.get("groupBy") || "type";

  const filters: OfferFilterStatsForm = React.useMemo(
    () => ({
      period: (searchParams.get("period") || "year") as "year" | "month" | "week",
      bien_type_id: searchParams.get("bien_type_id") || undefined,
      wilaya_id: searchParams.get("wilaya_id") || undefined,
      commune_id: searchParams.get("commune_id") || undefined,
    }),
    [
      searchParams.get("commune_id"),
      searchParams.get("bien_type_id"),
      searchParams.get("wilaya_id"),
      searchParams.get("period"),
    ],
  );

  const [data, setData] = React.useState<BienDistribution[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [isPending, startTransition] = React.useTransition();

  // 2. Fetch data based on the URL's currentGroupBy and currentPeriod
  React.useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await getOfferStatsActions(currentGroupBy, filters);
        if (response) {
          setData(response);
        }
      } catch (error) {
        console.error("Error fetching demands distribution:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentGroupBy, filters]);

  // 3. Handle groupBy change
  const handleGroupByChange = (newValue: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("groupBy", newValue);

    // If switching to creation and no period is set, default to month
    if (newValue === "creation" && !params.has("period")) {
      params.set("period", "month");
    }

    // If switching away from creation, remove period param
    if (newValue !== "creation" && params.has("period")) {
      params.delete("period");
    }

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    });
  };

  const useBarChart = currentGroupBy === "creation";

  return (
    <Card className="w-full rounded-3xl border-none bg-[#FDFCF9] shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">Statistiques</p>
          <CardTitle className="text-2xl font-bold">{TITLE_MAP[currentGroupBy]}</CardTitle>
          <CardDescription>{DESCRIPTION_MAP[currentGroupBy]}</CardDescription>
        </div>

        <div className="flex flex-col gap-2">
          {/* GroupBy Selector */}
          <Select value={currentGroupBy} onValueChange={handleGroupByChange} disabled={isPending}>
            <SelectTrigger className="w-[140px] rounded-full bg-white border-slate-200">
              {isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <SelectValue placeholder="Par Type" />}
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="type">Par Type</SelectItem>
              <SelectItem value="status">Par Statut</SelectItem>
              <SelectItem value="creation">Par Création</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent className="flex flex-col md:flex-row items-center justify-between pt-6 min-h-[300px]">
        {loading ? (
          <div className="flex w-full items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
          </div>
        ) : useBarChart ? (
          // Bar Chart for Creation Grouping
          <div className="w-full h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} maxBarSize={40}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis
                  dataKey={(item) => item.label[locale] || item.label.fr}
                  // textAnchor="end"
                  height={80}
                  tick={{ fill: "#64748B", fontSize: 12 }}
                />
                <YAxis tick={{ fill: "#64748B", fontSize: 12 }} />
                <Bar dataKey="value" fill={BAR_COLOR} radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          // Pie Chart for Other Groupings
          <>
            <div className="h-80 w-full md:w-1/2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    innerRadius={80}
                    outerRadius={100}
                    paddingAngle={8}
                    dataKey="value"
                    stroke="none"
                    cornerRadius={50}
                  >
                    {data.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      borderRadius: "12px",
                      border: "none",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="w-full md:w-1/2 space-y-4 px-4">
              {data.map((entry, index) => {
                const total = data.reduce((acc, item) => acc + item.value, 0);
                const percentage = total > 0 ? ((entry.value / total) * 100).toFixed(1) : 0;

                return (
                  <div key={entry.label.fr} className="flex items-center justify-between group">
                    <div className="flex items-center gap-3">
                      <div
                        className="h-3 w-3 rounded-full"
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      />
                      <span className="text-sm font-medium text-slate-600">
                        {entry.label[locale] || entry.label.fr}
                      </span>
                    </div>
                    <span className="text-sm font-bold text-slate-800">{percentage}%</span>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

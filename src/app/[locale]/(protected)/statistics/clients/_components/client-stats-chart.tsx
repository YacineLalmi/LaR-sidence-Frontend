"use client";

import * as React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { BienDistribution } from "@/schemas/dashboard/bien-distribution.schema";
import { useLocale } from "next-intl";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import getClientStatsActions from "@/actions/statistics/get-client-stats.action";

const COLORS = ["#A7F3D0", "#FDE68A", "#BFDBFE", "#DDD6FE", "#FCA5A5", "#F9A8D4"];

export function ClientStatsChart() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const locale = useLocale() as "fr" | "en" | "ar";

  // 1. Retrieve the 'groupBy' value from the URL query params (default to 'type')
  const currentGroupBy = searchParams.get("groupBy") || "type";

  const [data, setData] = React.useState<BienDistribution[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [isPending, startTransition] = React.useTransition();

  // 2. Fetch data based on the URL's currentGroupBy
  React.useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await getClientStatsActions(currentGroupBy);
        if (response) {
          setData(response);
        }
      } catch (error) {
        console.error("Error fetching bien distribution:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentGroupBy]);

  // 3. Handle change using startTransition to update query params
  const handleGroupByChange = (newValue: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("groupBy", newValue);

    startTransition(() => {
      // Shallows navigation to update the URL without a full page reload
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    });
  };

  return (
    <Card className="w-full rounded-3xl border-none bg-[#FDFCF9] shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">Statistiques</p>
          <CardTitle className="text-2xl font-bold">Répartition des Clients</CardTitle>
          <CardDescription>Consultez la Répartition des Clients par {currentGroupBy}.</CardDescription>
        </div>

        <Select
          value={currentGroupBy}
          onValueChange={handleGroupByChange}
          disabled={isPending} // Disable interaction while transitioning
        >
          <SelectTrigger className="w-[140px] rounded-full bg-white border-slate-200">
            {isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <SelectValue placeholder="Par Type" />}
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="type">Par Type</SelectItem>
            <SelectItem value="status">Par Statut</SelectItem>
            <SelectItem value="source">Par Source</SelectItem>
            <SelectItem value="civility">Par Civilité</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>

      <CardContent className="flex flex-col md:flex-row items-center justify-between pt-6 min-h-[300px]">
        {loading ? (
          <div className="flex w-full items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
          </div>
        ) : (
          <>
            <div className="h-[250px] w-full md:w-1/2">
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

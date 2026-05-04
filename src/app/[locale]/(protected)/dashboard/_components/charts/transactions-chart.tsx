"use client";

import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import getTransactionsAction from "@/actions/dashboard/get-transactions.action";
import { ChartStats } from "@/schemas/dashboard/chart-stats.schema";

export function TransactionsChart() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [transactions, setTransactions] = useState<ChartStats | null>(null);

  useEffect(() => {
    setIsLoading(true);
    getTransactionsAction()
      .then((data) => setTransactions(data))
      .catch((error) => console.error(error))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return (
      <Card className="w-full rounded-[40px] border-none bg-white p-8 shadow-sm relative">
        <div className="flex justify-between items-center mb-8">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-10 w-24 rounded-full" />
        </div>
        <Skeleton className="h-[300px] w-full rounded-2xl" />
      </Card>
    );
  }

  return (
    <Card className="w-full rounded-[40px] border-none bg-white p-8 shadow-sm relative">
      <CardContent className="p-0">
        <div className="flex flex-col gap-1 mb-6">
          <h3 className="text-xl font-bold text-gray-900">Statistiques</h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <h2 className="text-3xl font-bold">Transactions</h2>
              <div className="h-8 w-[1px] bg-gray-200" />
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-black" />
                  <span className="text-sm font-medium text-gray-600">Ventes</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-[#C9AF72]" />
                  <span className="text-sm font-medium text-gray-600">Locations</span>
                </div>
              </div>
            </div>

            {/* Dropdown Selector */}
            <div className="flex items-center gap-2 rounded-full border border-gray-200 px-4 py-2 text-gray-400">
              <span className="text-sm">Mois</span>
              <ChevronDown size={16} />
            </div>
          </div>
        </div>

        <div className="h-80 w-full mt-10">
          {transactions ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={transactions?.data} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                <CartesianGrid vertical={false} stroke="#F0F0F0" />
                <XAxis dataKey="label" axisLine={true} tickLine={false} tick={{ fill: "#666", fontSize: 12 }} dy={15} />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#666", fontSize: 12 }}
                  ticks={[0, transactions.max * 0.5, transactions.max * 0.75, transactions.max]}
                />
                <Tooltip cursor={{ stroke: "#F0F0F0", strokeWidth: 2 }} contentStyle={{ borderRadius: "12px" }} />

                {/* Ventes Line */}
                <Line
                  type="monotone"
                  dataKey="ventes"
                  stroke="#000000"
                  strokeWidth={3}
                  dot={false}
                  activeDot={{ r: 6 }}
                />

                {/* Locations Line */}
                <Line
                  type="monotone"
                  dataKey="locations"
                  stroke="#C9AF72"
                  strokeWidth={3}
                  dot={false}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <h1>No data fount</h1>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

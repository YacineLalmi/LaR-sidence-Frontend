"use client";

import { ArrowUpRight, Percent, TrendingDown, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { StatCardSkeleton } from "./stat-card-skeleton";
import { Stats } from "@/schemas/dashboard/stats.schema";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";

interface Props {
  title?: string;
  action: () => Promise<Stats | null>;
}

export function StatCard({ title, action }: Props) {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [stats, setStats] = useState<Stats | null>();
  const cardClasses = "rounded-[40px] border-none bg-white p-7 shadow-sm";

  const isUp = stats?.trend === "up";

  useEffect(() => {
    setIsLoading(true);
    action()
      .then((data) => setStats(data))
      .catch((error) => console.error(error))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) return <StatCardSkeleton />;

  return (
    <Card className={cardClasses}>
      <CardContent className="p-0">
        {/* Header Section */}
        <div className="flex justify-between items-start mb-2">
          <h2 className="text-2xl max-w-28 font-semibold leading-tight">{title}</h2>
          <Link href={ROUTES.BIENS.ROOT}>
            <div className="flex size-14 items-center justify-center rounded-full bg-[#C9AF72] text-white">
              <ArrowUpRight size={32} strokeWidth={2.5} />
            </div>
          </Link>
        </div>

        {/* Data Section */}
        <div className="flex justify-between items-end">
          <span className="text-4xl font-bold text-black">{stats?.all_time_count}</span>

          <div className="flex items-center gap-1 font-medium text-lg" style={{ color: isUp ? "#86D3B3" : "red" }}>
            <div className="flex items-center">
              {stats?.change_percent} <Percent size={15} />
            </div>
            {isUp ? <TrendingUp size={20} /> : <TrendingDown color="red" size={20} />}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

import { redirect } from "next/navigation";

import { ROUTES } from "@/constants/routes";
import { StatisticsPageView } from "@/views/statistics/statistics-page.view";

type Props = {
  params: Promise<{ section: string }>;
};

export default async function StatisticsSectionPage({ params }: Props) {
  const { section } = await params;
  if (section === "summary") {
    redirect(ROUTES.STATISTICS.SECTION("biens"));
  }
  return <StatisticsPageView section={section} />;
}

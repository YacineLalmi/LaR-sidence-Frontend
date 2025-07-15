import { ChartAreaInteractive } from "./_components/area-chart";
import { ChartBarMultiple } from "./_components/bar-chart";
import { ChartPieSeparatorNone } from "./_components/pie-chart";
import { ChartRadarDots } from "./_components/radar";
import { ChartRadialStacked } from "./_components/radial";
import { StatsCard } from "./_components/stats-card";

export default function TableauDeBord() {
  return (
    <div className="grid grid-cols-4 grid-rows-5 gap-4">
      <div>
        <StatsCard />
      </div>
      <div>
        <StatsCard />
      </div>
      <div>
        <StatsCard />
      </div>
      <div>
        <StatsCard />
      </div>
      <div className="col-span-2 row-span-2">
        <ChartPieSeparatorNone />
      </div>
      <div className="row-span-2 col-start-3">
        <ChartRadarDots />
      </div>
      <div className="row-span-2 col-start-4">
        <ChartRadarDots />
      </div>
      <div className="col-span-4 row-span-2 row-start-4">
        <ChartAreaInteractive />
      </div>
    </div>
  );
}

import { FilterPanel } from "./_components/filter-panel";
import { DemandStatsChart } from "./_components/demand-stats-chart";

export default function page() {
  return (
    <div className="grid grid-cols-3">
      <div className="col-span-1">
        <FilterPanel />
      </div>
      <div className="col-span-2">
        <DemandStatsChart />
      </div>
    </div>
  );
}

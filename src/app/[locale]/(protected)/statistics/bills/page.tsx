import { BillStatsChart } from "./_components/bill-stats-chart";
import { FilterPanel } from "./_components/filter-panel";

export default function page() {
  return (
    <div className="grid grid-cols-3">
      <div className="col-span-1">
        <FilterPanel />
      </div>
      <div className="col-span-2">
        <BillStatsChart />
      </div>
    </div>
  );
}

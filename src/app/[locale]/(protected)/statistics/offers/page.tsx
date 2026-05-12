import { FilterPanel } from "./_components/filter-panel";
import { OfferStatsChart } from "./_components/offer-stats-chart";

export default function page() {
  return (
    <div className="grid grid-cols-3">
      <div className="col-span-1">
        <FilterPanel />
      </div>
      <div className="col-span-2">
        <OfferStatsChart />
      </div>
    </div>
  );
}

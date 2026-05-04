import React from "react";
import { FilterPanel } from "./_components/filter-panel";
import { BienDistributionChart } from "./_components/bien-distribution-chart";

export default function page() {
  return (
    <div className="grid grid-cols-3">
      <div className="col-span-1">
        <FilterPanel />
      </div>
      <div className="col-span-2">
        <BienDistributionChart />
      </div>
    </div>
  );
}

import DataTableSkeleton from "@/components/data-table/_components/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import React from "react";

export default function loading() {
  return (
    <Card>
      <CardContent>
        <DataTableSkeleton />
      </CardContent>
    </Card>
  );
}

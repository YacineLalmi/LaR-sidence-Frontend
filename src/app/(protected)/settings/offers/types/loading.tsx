"use client";
import TableSkeleton from "@/components/skeletons/table.skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

export default function loading() {
  return (
    <Card className="bg-transparent border-none shadow-none px-0">
      <CardHeader className="px-0 flex flex-col">
        <div className="flex gap-3 items-center">
          <Skeleton className="h-[40px] w-[40px] rounded-full" />
          <Skeleton className="h-[40px] w-[500px] rounded-full" />
        </div>
        <div className="flex w-full justify-between gap-2">
          <Skeleton className="h-[50px] w-[600px] rounded-full" />
          <Skeleton className="h-[50px] w-[200px] rounded-full" />
        </div>
      </CardHeader>
      <CardContent className="px-0">
        <TableSkeleton />
      </CardContent>
    </Card>
  );
}

"use client";
import React, { useCallback } from "react";
import { Button } from "./button";
import { ArrowUpDown } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

interface Props {
  columnName: string;
  columnKey: string;
}

export default function SortingButton({ columnName, columnKey }: Props) {
  const queryParams = useSearchParams();
  const router = useRouter();
  const sort = queryParams.get("sort");
  const handleSorting = useCallback(() => {
    let newSort = columnKey;
    if (sort === columnKey) {
      newSort = "-" + columnKey;
    }

    const params = new URLSearchParams(window.location.search);
    params.set("sort", newSort);
    router.push(`?${params.toString()}`);
  }, [sort]);
  return (
    <Button variant="ghost" onClick={handleSorting} className="cursor-pointer">
      {columnName}
      <ArrowUpDown />
    </Button>
  );
}

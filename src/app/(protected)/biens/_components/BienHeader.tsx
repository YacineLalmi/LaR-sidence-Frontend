import SearchField from "@/components/ui/search";
import React from "react";
import BienFilter from "./BienFilter";

export default function BienHeader() {
  return (
    <>
      <div className="flex items-center gap-2 justify-between w-full p-0">
        <div className="flex w-full gap-2">
          <SearchField />
          <BienFilter />
        </div>
      </div>
    </>
  );
}

import SearchField from "@/components/ui/search";
import React from "react";
import UsersFilters from "./UsersFilters";

export default function UsersHeader() {
  return (
    <div className="flex w-full gap-2">
      <SearchField />
      <UsersFilters />
    </div>
  );
}

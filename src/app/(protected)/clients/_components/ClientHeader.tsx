import SearchField from "@/components/ui/search";
import React from "react";
import ClientFilter from "./ClientFilter";
import { ListItem } from "@/schemas/Global.schema";

interface Props {
  types: ListItem[];
  status: ListItem[];
  sources: ListItem[];
  genders: ListItem[];
}

export default function ClientHeader({ types, status, sources, genders }: Props) {
  return (
    <>
      <div className="flex items-center gap-2 justify-between w-full p-0">
        <div className="flex w-full gap-2">
          <SearchField />
          <ClientFilter types={types} status={status} sources={sources} genders={genders} />
        </div>
      </div>
    </>
  );
}

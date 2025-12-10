import SearchField from "@/components/ui/search";
import React from "react";
import { ListItem } from "@/schemas/Global.schema";
import OffersFilter from "./OffersFilter";

interface Props {
  biens: ListItem[];
  types: ListItem[];
  clients: ListItem[];
  status: ListItem[];
}

export default function OffersHeader({ types, status, clients, biens }: Props) {
  return (
    <>
      <div className="flex items-center gap-2 justify-between w-full p-0">
        <div className="flex w-full gap-2">
          <SearchField />
          <OffersFilter types={types} status={status} biens={biens} clients={clients} />
        </div>
      </div>
    </>
  );
}

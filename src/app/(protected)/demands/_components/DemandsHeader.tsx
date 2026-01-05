import SearchField from "@/components/ui/search";
import React from "react";
import { ListItem } from "@/schemas/global.schema";
import DemandsFilter from "./DemandsFilter";

interface Props {
  types: ListItem[];
  status: ListItem[];
  priorities: ListItem[];
  sources: ListItem[];
  clients: ListItem[];
  biens: ListItem[];
  agents: ListItem[];
}

export default function DemandsHeader({ types, status, priorities, sources, clients, biens, agents }: Props) {
  return (
    <>
      <div className="flex items-center gap-2 justify-between w-full p-0">
        <div className="flex w-full gap-2">
          <SearchField />
          <DemandsFilter
            types={types}
            status={status}
            priorities={priorities}
            sources={sources}
            clients={clients}
            biens={biens}
            agents={agents}
          />
        </div>
      </div>
    </>
  );
}


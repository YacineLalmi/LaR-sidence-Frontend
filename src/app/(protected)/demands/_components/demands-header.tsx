import SearchField from "@/components/ui/search";
import React from "react";
import { ListItem } from "@/schemas/global.schema";
import DemandsFilter from "./demands-filters";
import Link from "next/link";
import CustomButton from "@/components/ui/custom-button";
import { getTranslations } from "next-intl/server";
import { Plus } from "lucide-react";
import { TRANSLATIONS_KEYS_2 } from "@/i18n/translation-keys";
import { ROUTES } from "@/constants/routes";

interface Props {
  types: ListItem[];
  status: ListItem[];
  priorities: ListItem[];
  sources: ListItem[];
  clients: ListItem[];
  biens: ListItem[];
  agents: ListItem[];
}

export default async function DemandsHeader({ types, status, priorities, sources, clients, biens, agents }: Props) {
  const translation = await getTranslations();
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
        <Link href={ROUTES.DEMANDS.CREATE}>
          <CustomButton text={translation(TRANSLATIONS_KEYS_2.DEMANDS.FORM.BUTTONS.CREATE)} Icon={Plus} />
        </Link>
      </div>
    </>
  );
}

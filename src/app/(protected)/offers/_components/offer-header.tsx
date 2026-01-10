import SearchField from "@/components/ui/search";
import React from "react";
import { ListItem } from "@/schemas/global.schema";
import OffersFilter from "./offer-filter";
import Link from "next/link";
import CustomButton from "@/components/ui/custom-button";
import { NAVIGATION_KEYS } from "@/lib/navigation-constants";
import { TRANSLATIONS_KEYS } from "@/i18n/translation-constants";
import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";

interface Props {
  biens: ListItem[];
  types: ListItem[];
  clients: ListItem[];
  status: ListItem[];
}

export default function OffersHeader({ types, status, clients, biens }: Props) {
  const translation = useTranslations();
  return (
    <div className="flex items-center gap-2 justify-between w-full p-0">
      <div className="flex w-full gap-2">
        <SearchField />
        <OffersFilter types={types} status={status} biens={biens} clients={clients} />
      </div>
      <Link href={NAVIGATION_KEYS.OFFERS.ADD}>
        <CustomButton text={translation(TRANSLATIONS_KEYS.OFFERS.ADD_OFFER)} Icon={Plus} />
      </Link>
    </div>
  );
}

import SearchField from "@/components/ui/search";
import React from "react";
import ClientFilter from "./ClientFilter";
import { ListItem } from "@/schemas/global.schema";
import { NAVIGATION_KEYS } from "@/lib/navigation-constants";
import Link from "next/link";
import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import CustomButton from "@/components/ui/custom-button";
import { TRANSLATIONS_KEYS } from "@/i18n/translation-constants";

interface Props {
  types: ListItem[];
  status: ListItem[];
  sources: ListItem[];
  civilities: ListItem[];
}

export default function ClientHeader({ types, status, sources, civilities }: Props) {
  const translation = useTranslations();
  return (
    <div className="flex items-center gap-2 justify-between w-full p-0">
      <div className="flex w-full gap-2">
        <SearchField />
        <ClientFilter types={types} status={status} sources={sources} civilities={civilities} />
      </div>
      <Link href={NAVIGATION_KEYS.CLIENTS.ADD}>
        <CustomButton text={translation(TRANSLATIONS_KEYS.CLIENTS.ADD_CLIENT)} Icon={Plus} />
      </Link>
    </div>
  );
}

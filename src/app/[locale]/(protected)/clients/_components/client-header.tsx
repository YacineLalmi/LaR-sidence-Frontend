import SearchField from "@/components/ui/search";
import ClientFilters from "./client-filters";
import { ListItem } from "@/schemas/global.schema";
import Link from "next/link";
import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import CustomButton from "@/components/ui/custom-button";
import { ROUTES } from "@/constants/routes";
import { TRANSLATIONS_KEYS_2 } from "@/i18n/translation-keys";

export default function ClientHeader() {
  const translation = useTranslations();
  return (
    <div className="flex items-center gap-2 justify-between w-full p-0">
      <div className="flex w-full gap-2">
        <SearchField />
        <ClientFilters />
      </div>
      <Link href={ROUTES.CLIENTS.CREATE}>
        <CustomButton text={translation(TRANSLATIONS_KEYS_2.CLIENTS.FORM.BUTTONS.CREATE)} Icon={Plus} />
      </Link>
    </div>
  );
}

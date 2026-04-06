import SearchField from "@/components/ui/search";
import { ListItem } from "@/schemas/global.schema";
import OffersFilter from "./offer-filter";
import Link from "next/link";
import CustomButton from "@/components/ui/custom-button";
import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { ROUTES } from "@/constants/routes";
import { TRANSLATIONS_KEYS_2 } from "@/i18n/translation-keys";

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
      <Link href={ROUTES.OFFERS.CREATE}>
        <CustomButton text={translation(TRANSLATIONS_KEYS_2.OFFERS.FORM.BUTTONS.CREATE)} Icon={Plus} />
      </Link>
    </div>
  );
}

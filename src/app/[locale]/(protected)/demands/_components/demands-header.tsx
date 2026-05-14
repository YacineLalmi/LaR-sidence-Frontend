import SearchField from "@/components/ui/search";
import DemandsFilter from "./demands-filters";
import { Link } from "@/i18n/navigation";
import CustomButton from "@/components/ui/custom-button";
import { getTranslations } from "next-intl/server";
import { Plus } from "lucide-react";
import { TRANSLATIONS_KEYS_2 } from "@/i18n/translation-keys";
import { ROUTES } from "@/constants/routes";

export default async function DemandsHeader() {
  const translation = await getTranslations();
  return (
    <>
      <div className="flex items-center gap-2 justify-between w-full p-0">
        <div className="flex w-full gap-2">
          <SearchField />
          <DemandsFilter />
        </div>
        <Link href={ROUTES.DEMANDS.CREATE}>
          <CustomButton text={translation(TRANSLATIONS_KEYS_2.DEMANDS.FORM.BUTTONS.CREATE)} Icon={Plus} />
        </Link>
      </div>
    </>
  );
}

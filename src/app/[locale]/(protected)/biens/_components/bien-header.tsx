import SearchField from "@/components/ui/search";
import BienFilter from "./bien-filter";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { TRANSLATIONS_KEYS_2 } from "@/i18n/translation-keys";
import { ROUTES } from "@/constants/routes";

export default function BienHeader() {
  const translation = useTranslations();
  return (
    <>
      <div className="flex items-center gap-2 justify-between w-full p-0">
        <div className="flex w-full gap-2">
          <SearchField />
          <BienFilter />
        </div>
        <Link href={ROUTES.BIENS.CREATE}>
          <Button className="cursor-pointer p-6 rounded-4xl flex gap-1 hover:bg-amber-200 hover:text-black hover:border-gray-600 border-1">
            <Plus />
            {translation(TRANSLATIONS_KEYS_2.BIENS.FORM.BUTTONS.CREATE)}
          </Button>
        </Link>
      </div>
    </>
  );
}

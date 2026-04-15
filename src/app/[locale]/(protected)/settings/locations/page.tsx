import NavigationButton from "@/components/ui/navigation-button";
import { getTranslations } from "next-intl/server";
import WilayaView from "./_components/wilayas/wilaya-view";
import CommuneView from "./_components/communes/commune-view";
import { TRANSLATIONS_KEYS_2 } from "@/i18n/translation-keys";
import { ROUTES } from "@/constants/routes";

export default async function Location({ searchParams }: { searchParams: Promise<{ [key: string]: string }> }) {
  const queryParams = await searchParams;
  const locationTranslation = await getTranslations();

  return (
    <div className="flex flex-col">
      <NavigationButton
        title={locationTranslation(TRANSLATIONS_KEYS_2.SETTINGS.LOCATIONS.TITLE)}
        backLink={ROUTES.SETTINGS.ROOT}
      />
      <div className="grid grid-cols-2 gap-[32px]">
        <WilayaView searchParams={queryParams} />
        <CommuneView searchParams={queryParams} />
      </div>
    </div>
  );
}

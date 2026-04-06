import { ColorService } from "@/services/colors.service";
import ColorTable from "./_components/color-table";
import SearchField from "@/components/ui/search";
import { getTranslations } from "next-intl/server";
import CreateColorDialog from "./_components/create-color-dialog";
import SettingsView from "@/views/settings.view";
import { TRANSLATIONS_KEYS_2 } from "@/i18n/translation-keys";
import { ROUTES } from "@/constants/routes";

export default async function Colors({ searchParams }: { searchParams: Promise<{ [key: string]: string }> }) {
  const queryParams = await searchParams;
  const translation = await getTranslations();

  const data = await ColorService.findMany(queryParams);
  return (
    <SettingsView
      searchField={<SearchField />}
      createComponent={<CreateColorDialog />}
      title={translation(TRANSLATIONS_KEYS_2.SETTINGS.COLORS.TITLE)}
      backLink={ROUTES.SETTINGS.ROOT}
    >
      <ColorTable data={data} />
    </SettingsView>
  );
}

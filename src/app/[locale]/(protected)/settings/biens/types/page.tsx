import BienTypeTable from "./_components/bien-type-table";
import { getTranslations } from "next-intl/server";
import SearchField from "@/components/ui/search";
import { CATEGORIES, ClassificationService, SCOPES } from "@/services/classification.service";
import SettingsView from "@/views/settings.view";
import { PaginatedResponse } from "@/lib/definitions";
import { Classification } from "@/schemas/classification/classification.schema";
import CreateBienTypeDialog from "./_components/create-bien-type-dialog";
import { TRANSLATIONS_KEYS_2 } from "@/i18n/translation-keys";
import { ROUTES } from "@/constants/routes";

export default async function BienType({ searchParams }: { searchParams: Promise<{ [key: string]: string }> }) {
  const queryParams = await searchParams;
  const translation = await getTranslations();

  let result: PaginatedResponse<Classification> = { data: [], meta: undefined };
  let responseError: Error | null = null;

  try {
    result = await ClassificationService(CATEGORIES.TYPE, SCOPES.BIEN).findMany(queryParams);
  } catch (error: any) {
    responseError = error;
  }
  return (
    <SettingsView
      title={translation(TRANSLATIONS_KEYS_2.SETTINGS.BIENS.TYPES.TITLE)}
      searchField={<SearchField />}
      createComponent={<CreateBienTypeDialog />}
      error={responseError}
      backLink={ROUTES.SETTINGS.ROOT}
    >
      <BienTypeTable data={result} />
    </SettingsView>
  );
}

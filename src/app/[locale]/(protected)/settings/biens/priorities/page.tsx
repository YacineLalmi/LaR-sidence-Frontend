import { getTranslations } from "next-intl/server";
import SearchField from "@/components/ui/search";
import { CATEGORIES, ClassificationService, SCOPES } from "@/services/classification.service";
import { ColorService } from "@/services/colors.service";
import SettingsView from "@/views/settings.view";
import { PaginatedResponse } from "@/lib/definitions";
import { Classification } from "@/schemas/classification/classification.schema";
import { TRANSLATIONS_KEYS_2 } from "@/i18n/translation-keys";
import CreateBienPriorityDialog from "./_components/create-bien-priority-dialog";
import BienPriorityTable from "./_components/bien-priority-table";
import { ROUTES } from "@/constants/routes";

export default async function BienPriority({ searchParams }: { searchParams: Promise<{ [key: string]: string }> }) {
  const queryParams = await searchParams;
  const translation = await getTranslations();

  let result: PaginatedResponse<Classification> = { data: [], meta: undefined };
  let responseError: Error | null = null;

  try {
    result = await ClassificationService(CATEGORIES.PRIORITY, SCOPES.BIEN).findMany(queryParams);
  } catch (error: any) {
    responseError = error;
  }
  return (
    <SettingsView
      title={translation(TRANSLATIONS_KEYS_2.SETTINGS.BIENS.PRIORITIES.TITLE)}
      searchField={<SearchField />}
      createComponent={<CreateBienPriorityDialog />}
      error={responseError}
      backLink={ROUTES.SETTINGS.ROOT}
    >
      <BienPriorityTable data={result} />
    </SettingsView>
  );
}

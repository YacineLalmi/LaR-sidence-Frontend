import { getTranslations } from "next-intl/server";
import SearchField from "@/components/ui/search";
import { CATEGORIES, ClassificationService, SCOPES } from "@/services/classification.service";
import SettingsView from "@/views/settings.view";
import { PaginatedResponse } from "@/lib/definitions";
import { Classification } from "@/schemas/classification/classification.schema";
import { TRANSLATIONS_KEYS_2 } from "@/i18n/translation-keys";
import CreateDemandSourceDialog from "./_components/create-demand-source-dialog";
import DemandSourceTable from "./_components/demand-source-table";

export default async function StatusType({ searchParams }: { searchParams: Promise<{ [key: string]: string }> }) {
  const queryParams = await searchParams;
  const translation = await getTranslations();

  let result: PaginatedResponse<Classification> = { data: [], meta: undefined };
  let responseError: Error | null = null;

  try {
    result = await ClassificationService(CATEGORIES.SOURCE, SCOPES.DEMAND).findMany(queryParams);
  } catch (error: any) {
    responseError = error;
  }
  return (
    <SettingsView
      title={translation(TRANSLATIONS_KEYS_2.SETTINGS.DEMANDS.SOURCES.TITLE)}
      searchField={<SearchField />}
      createComponent={<CreateDemandSourceDialog />}
      error={responseError}
    >
      <DemandSourceTable data={result} />
    </SettingsView>
  );
}

import { getTranslations } from "next-intl/server";
import SearchField from "@/components/ui/search";
import { CATEGORIES, ClassificationService, SCOPES } from "@/services/classification.service";
import { ColorService } from "@/services/colors.service";
import SettingsView from "@/views/settings.view";
import { PaginatedResponse } from "@/lib/definitions";
import { Classification } from "@/schemas/classification/classification.schema";
import { TRANSLATIONS_KEYS_2 } from "@/i18n/translation-keys";
import CreateDemandStatusDialog from "./_components/create-demand-status-dialog";
import DemandStatusTable from "./_components/demand-status-table";

export default async function StatusType({ searchParams }: { searchParams: Promise<{ [key: string]: string }> }) {
  const queryParams = await searchParams;
  const translation = await getTranslations();

  let result: PaginatedResponse<Classification> = { data: [], meta: undefined };
  let responseError: Error | null = null;

  try {
    result = await ClassificationService(CATEGORIES.STATUS, SCOPES.DEMAND).findMany(queryParams);
  } catch (error: any) {
    responseError = error;
  }
  return (
    <SettingsView
      title={translation(TRANSLATIONS_KEYS_2.SETTINGS.DEMANDS.STATUSES.TITLE)}
      searchField={<SearchField />}
      createComponent={<CreateDemandStatusDialog  />}
      error={responseError}
    >
      <DemandStatusTable data={result} />
    </SettingsView>
  );
}

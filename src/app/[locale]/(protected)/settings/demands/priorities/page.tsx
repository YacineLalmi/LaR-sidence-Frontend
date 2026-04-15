import { getTranslations } from "next-intl/server";
import SearchField from "@/components/ui/search";
import { CATEGORIES, ClassificationService, SCOPES } from "@/services/classification.service";
import { ColorService } from "@/services/colors.service";
import SettingsView from "@/views/settings.view";
import { PaginatedResponse } from "@/lib/definitions";
import { Classification } from "@/schemas/classification/classification.schema";
import { TRANSLATIONS_KEYS_2 } from "@/i18n/translation-keys";
import DemandPriorityTable from "./_components/demand-priority-table";
import CreateDemandPriorityDialog from "./_components/create-demand-priority-dialog";

export default async function BienPriority({ searchParams }: { searchParams: Promise<{ [key: string]: string }> }) {
  const queryParams = await searchParams;
  const translation = await getTranslations();

  const colors = await ColorService.list();

  let result: PaginatedResponse<Classification> = { data: [], meta: undefined };
  let responseError: Error | null = null;

  try {
    result = await ClassificationService(CATEGORIES.PRIORITY, SCOPES.DEMAND).findMany(queryParams);
  } catch (error: any) {
    responseError = error;
  }
  return (
    <SettingsView
      title={translation(TRANSLATIONS_KEYS_2.SETTINGS.DEMANDS.PRIORITIES.TITLE)}
      searchField={<SearchField />}
      createComponent={<CreateDemandPriorityDialog colors={colors} />}
      error={responseError}
    >
      <DemandPriorityTable data={result} colors={colors} />
    </SettingsView>
  );
}

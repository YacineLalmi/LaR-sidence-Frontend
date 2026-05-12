import SearchField from "@/components/ui/search";
import { CATEGORIES, ClassificationService, SCOPES } from "@/services/classification.service";
import SettingsView from "@/views/settings.view";
import { PaginatedResponse } from "@/lib/definitions";
import { Classification } from "@/schemas/classification/classification.schema";
import CreateBienPriorityDialog from "./_components/create-bien-priority-dialog";
import BienPriorityTable from "./_components/bien-priority-table";
import { ROUTES } from "@/constants/routes";

export default async function BienPriority({ searchParams }: { searchParams: Promise<{ [key: string]: string }> }) {
  const queryParams = await searchParams;

  let result: PaginatedResponse<Classification> = { data: [], meta: undefined };
  let responseError: Error | null = null;

  try {
    result = await ClassificationService(CATEGORIES.PRIORITY, SCOPES.BIEN).findMany(queryParams);
  } catch (error: any) {
    responseError = error;
  }
  return (
    <SettingsView
      searchField={<SearchField />}
      createComponent={<CreateBienPriorityDialog />}
      error={responseError}
      backLink={ROUTES.SETTINGS.ROOT}
    >
      <BienPriorityTable data={result} />
    </SettingsView>
  );
}

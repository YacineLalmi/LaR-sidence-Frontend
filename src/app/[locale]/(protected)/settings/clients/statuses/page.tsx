import SearchField from "@/components/ui/search";
import { CATEGORIES, ClassificationService, SCOPES } from "@/services/classification.service";
import SettingsView from "@/views/settings.view";
import { PaginatedResponse } from "@/lib/definitions";
import { Classification } from "@/schemas/classification/classification.schema";
import CreateClientStatusDialog from "./_components/create-client-status-dialog";
import ClientStatusTable from "./_components/client-status-table";
import { ROUTES } from "@/constants/routes";

export default async function StatusType({ searchParams }: { searchParams: Promise<{ [key: string]: string }> }) {
  const queryParams = await searchParams;

  let result: PaginatedResponse<Classification> = { data: [], meta: undefined };
  let responseError: Error | null = null;

  try {
    result = await ClassificationService(CATEGORIES.STATUS, SCOPES.CLEINT).findMany(queryParams);
  } catch (error: any) {
    responseError = error;
  }
  return (
    <SettingsView
      searchField={<SearchField />}
      createComponent={<CreateClientStatusDialog />}
      error={responseError}
      backLink={ROUTES.SETTINGS.ROOT}
    >
      <ClientStatusTable data={result} />
    </SettingsView>
  );
}

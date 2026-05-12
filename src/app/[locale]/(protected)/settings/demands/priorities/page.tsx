import SearchField from "@/components/ui/search";
import { CATEGORIES, ClassificationService, SCOPES } from "@/services/classification.service";
import SettingsView from "@/views/settings.view";
import { PaginatedResponse } from "@/lib/definitions";
import { Classification } from "@/schemas/classification/classification.schema";
import DemandPriorityTable from "./_components/demand-priority-table";
import CreateDemandPriorityDialog from "./_components/create-demand-priority-dialog";

export default async function BienPriority({ searchParams }: { searchParams: Promise<{ [key: string]: string }> }) {
  const queryParams = await searchParams;

  let result: PaginatedResponse<Classification> = { data: [], meta: undefined };
  let responseError: Error | null = null;

  try {
    result = await ClassificationService(CATEGORIES.PRIORITY, SCOPES.DEMAND).findMany(queryParams);
  } catch (error: any) {
    responseError = error;
  }
  return (
    <SettingsView searchField={<SearchField />} createComponent={<CreateDemandPriorityDialog />} error={responseError}>
      <DemandPriorityTable data={result} />
    </SettingsView>
  );
}

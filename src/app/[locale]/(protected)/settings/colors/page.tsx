import { ColorService } from "@/services/colors.service";
import ColorTable from "./_components/color-table";
import SearchField from "@/components/ui/search";
import CreateColorDialog from "./_components/create-color-dialog";
import SettingsView from "@/views/settings.view";
import { ROUTES } from "@/constants/routes";

export default async function Colors({ searchParams }: { searchParams: Promise<{ [key: string]: string }> }) {
  const queryParams = await searchParams;

  const data = await ColorService.findMany(queryParams);
  return (
    <SettingsView searchField={<SearchField />} createComponent={<CreateColorDialog />} backLink={ROUTES.SETTINGS.ROOT}>
      <ColorTable data={data} />
    </SettingsView>
  );
}

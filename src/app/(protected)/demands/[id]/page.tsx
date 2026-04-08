import { getTranslations } from "next-intl/server";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import NavigationButton from "@/components/ui/navigation-button";
import UpdateDemandForm from "./_components/update-demand-form";
import { DemandService } from "@/services/demand.service";
import { TRANSLATIONS_KEYS_2 } from "@/i18n/translation-keys";
import { ROUTES } from "@/constants/routes";

export default async function DemandDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id;
  const translation = await getTranslations();
  const demand = await DemandService.findOne(id);

  return (
    <Card className="bg-transparent border-none shadow-none p-0">
      <CardHeader className="px-0 flex flex-col">
        <NavigationButton
          title={translation(TRANSLATIONS_KEYS_2.DEMANDS.FORM.TITLES.UPDATE)}
          backLink={ROUTES.DEMANDS.ROOT}
        />
      </CardHeader>
      <CardContent className="px-0">
        <UpdateDemandForm demand={demand} />
      </CardContent>
    </Card>
  );
}

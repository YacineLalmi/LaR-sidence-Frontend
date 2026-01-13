import { getTranslations } from "next-intl/server";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import NavigationButton from "@/components/ui/navigation-button";
import { TRANSLATIONS_KEYS } from "@/i18n/translation-constants";
import { NAVIGATION_KEYS } from "@/lib/navigation-constants";
import UpdateDemandForm from "./_components/update-demand-form";
import { DemandsService } from "@/services/demands.service";
import { DemandTypeService } from "@/services/demand-type.service";
import { DemandStatusService } from "@/services/demand-status.service";
import { DemandPriorityService } from "@/services/demand-priorities.service";
import { DemandSourceService } from "@/services/demand-source.service";
import { ClientService } from "@/services/client.service";
import { BienService } from "@/services/bien.service";
import { UserService } from "@/services/user.service";

export default async function DemandDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id;
  const translation = await getTranslations();
  const demand = await DemandsService.findOne(id);
  const types = await DemandTypeService.list().catch(() => []);
  const status = await DemandStatusService.list().catch(() => []);
  const priorities = await DemandPriorityService.list().catch(() => []);
  const sources = await DemandSourceService.list().catch(() => []);
  const clients = await ClientService.list();
  const biens = await BienService.list();
  const agents = await UserService.agentList().catch(() => []);

  return (
    <Card className="bg-transparent border-none shadow-none p-0">
      <CardHeader className="px-0 flex flex-col">
        <NavigationButton
          title={translation(TRANSLATIONS_KEYS.DEMANDS.FORM.EDIT_TITLE)}
          backLink={NAVIGATION_KEYS.DEMANDS.ROOT}
        />
      </CardHeader>
      <CardContent className="px-0">
        <UpdateDemandForm
          demand={demand}
          types={types}
          status={status}
          priorities={priorities}
          sources={sources}
          clients={clients}
          biens={biens}
          agents={agents}
        />
      </CardContent>
    </Card>
  );
}

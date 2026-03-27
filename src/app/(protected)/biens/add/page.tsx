import React from "react";
import { BienTypeService } from "@/services/bien-type.service";
import { BienStatusService } from "@/services/bien-status.service";
import { TransactionTypeService } from "@/services/transaction-type.service";
import { UserService } from "@/services/user.service";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { BienPriorityService } from "@/services/bien-priorities.service";
import { WilayaService } from "@/services/wilaya.service";
import { BienAdditionalcharacteristicsService } from "@/services/bien-additional-charactiristics.service";
import CreateBienForm from "./_components/create-bien-form";
import NavigationButton from "@/components/ui/navigation-button";
import { getTranslations } from "next-intl/server";
import { ClientService } from "@/services/client.service";
import { ClientTypeService } from "@/services/client-types.service";
import { ClientStatusService } from "@/services/client-status.service";
import { ClientSourceService } from "@/services/client-source.service";

export default async function BienStatusAddPage() {
  const bienTypes = await BienTypeService.list();
  const status = await BienStatusService.list();
  const transactionsTypes = await TransactionTypeService.list();
  const wilayas = await WilayaService.list();
  const agents = await UserService.agentList();
  const priorities = await BienPriorityService.list();
  const clients = await ClientService.list();
  const bienAdditionalcharacteristics = await BienAdditionalcharacteristicsService.list();
  const bienTranslation = await getTranslations("biens.form");
  const clientTypes = await ClientTypeService.list();
  const clientStatus = await ClientStatusService.list();
  const clientSources = await ClientSourceService.list();
  const civilities = [
    {
      id: "F",
      name: "Female",
    },
    {
      id: "M",
      name: "Male",
    },
    {
      id: "C",
      name: "Company",
    },
  ];

  return (
    <Card className="bg-transparent shadow-none border-none p-0">
      <CardHeader className="flex items-center gap-2">
        <NavigationButton title={bienTranslation("create")} backLink="/biens" />
      </CardHeader>
      <CardContent>
        <CreateBienForm
          agents={agents}
          bienTypes={bienTypes}
          status={status}
          transactionsTypes={transactionsTypes}
          wilayas={wilayas}
          priorities={priorities}
          clients={clients}
          bienAdditionalcharacteristics={bienAdditionalcharacteristics}
          clientTypes={clientTypes}
          clientStatus={clientStatus}
          clientSources={clientSources}
          civilities={civilities}
        />
      </CardContent>
    </Card>
  );
}

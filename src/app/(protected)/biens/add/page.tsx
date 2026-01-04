import React from "react";
import { BienTypeService } from "@/services/BienType.service";
import { BienStatusService } from "@/services/BienStatus.service";
import { TransactionTypeService } from "@/services/transaction-type.service";
import { UserService } from "@/services/users.service";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { BienPriorityService } from "@/services/bien-priorities.service";
import { WilayaService } from "@/services/wilaya.service";
import { BienAdditionalcharacteristicsService } from "@/services/bien-additional-charactiristics.service";
import CreateBienForm from "./_components/create-bien-form";
import NavigationButton from "@/components/ui/navigation-button";
import { getTranslations } from "next-intl/server";
import { ClientService } from "@/services/clients.service";

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
        />
      </CardContent>
    </Card>
  );
}

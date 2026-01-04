import React from "react";
import { BienTypeService } from "@/services/BienType.service";
import { BienStatusService } from "@/services/BienStatus.service";
import { TransactionTypeService } from "@/services/transaction-type.service";
import { UserService } from "@/services/users.service";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { BienPriorityService } from "@/services/bien-priorities.service";
import { WilayaService } from "@/services/wilaya.service";
import { BienAdditionalcharacteristicsService } from "@/services/bien-additional-charactiristics.service";
import UpdateBienForm from "./_components/update-bien-form";
import NavigationButton from "@/components/ui/navigation-button";
import { getTranslations } from "next-intl/server";
import { BienService } from "@/services/Bien.service";
import { TRANSLATIONS_KEYS } from "@/i18n/translation-constants";
import { ClientService } from "@/services/clients.service";

export default async function UpdateBienPage({ params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id;
  const bienTypes = await BienTypeService.list();
  const status = await BienStatusService.list();
  const transactionsTypes = await TransactionTypeService.list();
  const wilayas = await WilayaService.list();
  const agents = await UserService.agentList();
  const priorities = await BienPriorityService.list();
  const bienAdditionalcharacteristics = await BienAdditionalcharacteristicsService.list();
  const clients = await ClientService.list();
  const bienTranslation = await getTranslations();
  const bien = await BienService.findOne(id);
  return (
    <Card className="bg-transparent shadow-none border-none p-0">
      <CardHeader className="flex items-center gap-2">
        <NavigationButton title={bienTranslation(TRANSLATIONS_KEYS.BIENS.FORM.EDIT)} backLink="/biens" />
      </CardHeader>
      <CardContent>
        <UpdateBienForm
          clients={clients}
          bien={bien}
          agents={agents}
          bienTypes={bienTypes}
          status={status}
          transactionsTypes={transactionsTypes}
          wilayas={wilayas}
          priorities={priorities}
          bienAdditionalcharacteristics={bienAdditionalcharacteristics}
        />
      </CardContent>
    </Card>
  );
}

import React from "react";
import { BienTypeService } from "@/services/BienType.service";
import { BienStatusService } from "@/services/BienStatus.service";
import { TransactionTypeService } from "@/services/transaction-type.service";
import { UserService } from "@/services/users.service";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { BienPriorityService } from "@/services/bien-priorities.service";
import { WilayaService } from "@/services/wilaya.service";
import { BienAdditionalcharacteristicsService } from "@/services/bien-additional-charactiristics.service";
import CreateBienForm from "./_components/create-form";

export default async function BienStatusAddPage() {
  const bienTypes = await BienTypeService.list();
  const status = await BienStatusService.list();
  const transactionsTypes = await TransactionTypeService.list();
  const wilayas = await WilayaService.list();
  const agents = await UserService.agentList();
  const priorities = await BienPriorityService.list();
  const bienAdditionalcharacteristics = await BienAdditionalcharacteristicsService.list();
  return (
    <Card className="bg-transparent shadow-none border-none p-0">
      <CardHeader className="flex items-center gap-2">
        <Link
          href="/biens"
          className="rounded-full bg-black hover:bg-amber-200 h-8 w-8 flex items-center justify-center hover:text-black text-white transition duration-200"
        >
          <ArrowLeft size={15} />
        </Link>
        <h2 className="text-2xl font-bold">Ajouter un bien</h2>
      </CardHeader>
      <CardContent>
        <CreateBienForm
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

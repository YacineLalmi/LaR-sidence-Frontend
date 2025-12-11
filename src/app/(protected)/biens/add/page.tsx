import React from "react";
import BienAdd from "../_components/BienAdd";
import { BienTypeService } from "@/services/BienType.service";
import { BienStatusService } from "@/services/BienStatus.service";
import { TransactionTypeService } from "@/services/transaction-type.service";
import { UserService } from "@/services/users.service";
import AddBienForm from "./_components/add-form";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { BienPriorityService } from "@/services/bien-priorities.service";
import { WilayasService } from "@/services/wilayas.service";

export default async function BienStatusAddPage() {
  const bienTypes = await BienTypeService.list();
  const status = await BienStatusService.list();
  const transactionsTypes = await TransactionTypeService.list();
  const wilayas = await WilayasService.list();
  const agents = await UserService.agentList();
  const priorities = await BienPriorityService.list();
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
        <AddBienForm
          agents={agents}
          bienTypes={bienTypes}
          status={status}
          transactionsTypes={transactionsTypes}
          wilayas={wilayas}
          priorities={priorities}
        />
      </CardContent>
    </Card>
  );
}

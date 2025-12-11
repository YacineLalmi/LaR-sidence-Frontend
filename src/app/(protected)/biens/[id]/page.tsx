import React from "react";
import BienUpdate from "../_components/BienUpdate";
import { BienService } from "@/services/Bien.service";
import { BienTypeService } from "@/services/BienType.service";
import { BienStatusService } from "@/services/BienStatus.service";
import { TransactionTypeService } from "@/services/transaction-type.service";

export default async function BienStatusUpdatePage({ params }: { params: { id: string } }) {
  const id = params.id;
  const biens = await BienService.findOne(id);
  const types = await BienTypeService.findAll({ page: "1", perPage: "10" });
  const status = await BienStatusService.findAll({ page: "1", perPage: "10" });
  const transactions = await TransactionTypeService.findAll({ page: "1", perPage: "10" });

  // Transform the new schema format to the old format expected by BienUpdate component
  const transformedBien = {
    id: biens.id,
    title: biens.title || "",
    adresse: biens.adresse || "",
    wilaya: typeof biens.wilaya === "object" ? biens.wilaya?.name || "" : biens.wilaya || "",
    commune: typeof biens.commune === "object" ? biens.commune?.name || "" : biens.commune || "",
    peices: biens.rooms_number || null,
    bien_type: typeof biens.bien_type === "object" ? biens.bien_type?.name || "" : biens.bien_type || "",
    transaction_type: typeof biens.transaction_type === "object" ? biens.transaction_type?.name || "" : biens.transaction_type || "",
    status: typeof biens.status === "object" ? biens.status?.name || "" : biens.status || "",
    habitable_surface: biens.habitable_surface || 0,
    total_surface: biens.total_surface || 0,
    rooms: biens.rooms_number || 0,
    price: biens.price || 0,
    exclusivity: biens.exclusivity || false,
    exclusivity_start: biens.exclusivity_start ? new Date(biens.exclusivity_start) : null,
    exclusivity_end: biens.exclusivity_end ? new Date(biens.exclusivity_end) : null,
    responsible_agent: typeof biens.agent === "object" ? biens.agent?.id || "" : biens.agent || "",
  };

  return <BienUpdate item={transformedBien as any} types={types.items} status={status.items} transactions={transactions.items} />;
}

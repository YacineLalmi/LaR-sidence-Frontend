import React from "react";
import { getTranslations } from "next-intl/server";
import { ClientsService } from "@/services/clients.service";
import OffersTable from "./_components/OffersTable";
import { BienService } from "@/services/Bien.service";
import { OffersService } from "@/services/offers.service";

export default async function Offers({ searchParams }: { searchParams: Promise<{ [key: string]: string }> }) {
  const queryParams = await searchParams;

  const offers = await OffersService.findAll(queryParams);
  const biens = await BienService.list();
  const types = await OffersService.typesList();
  const clients = await ClientsService.list();
  const status = await ClientsService.statusList();

  const t = await getTranslations();
  return (
    <div className="flex flex-col gap-3">
      <div>
        <h1 className="text-2xl font-bold">{t("clients.title")}</h1>
      </div>
      <div>
        <OffersTable
          data={offers}
          biens={biens}
          types={types}
          clients={clients}
          status={status}
        />
      </div>
    </div>
  );
}

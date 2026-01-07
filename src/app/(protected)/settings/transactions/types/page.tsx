import React from "react";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { getTranslations } from "next-intl/server";
import { TRANSLATIONS_KEYS } from "@/i18n/translation-constants";
import SearchField from "@/components/ui/search";
import NavigationButton from "@/components/ui/navigation-button";
import { NAVIGATION_KEYS } from "@/lib/navigation-constants";
import { TransactionTypeService } from "@/services/transaction-type.service";
import CreateTransactionTypeDialog from "./_components/create-transactions-type-dialog";
import TransactionTypeTable from "./_components/transaction-type-table";

export default async function BienType({ searchParams }: { searchParams: Promise<{ [key: string]: string }> }) {
  const queryParams = await searchParams;
  const translation = await getTranslations();

  const data = await TransactionTypeService.findAll(queryParams);
  return (
    <Card className="bg-transparent border-none shadow-none px-0">
      <CardHeader className="px-0 flex flex-col">
        <NavigationButton
          title={translation(TRANSLATIONS_KEYS.SETTINGS.TRANSACTIONS.TYPES.TITLE)}
          backLink={NAVIGATION_KEYS.SETTINGS.TRANSACTIONS.ROOT}
        />
        {/* <h1 className="text-[24px] font-bold">{translation(TRANSLATIONS_KEYS.SETTINGS.BIENS.TYPES.TITLE)}</h1> */}
        <div className="flex w-full justify-between gap-2">
          <SearchField />
          <CreateTransactionTypeDialog />
        </div>
      </CardHeader>
      <CardContent className="px-0">
        <TransactionTypeTable data={data} />
      </CardContent>
    </Card>
  );
}

"use client";

import { getClassificationsListAction } from "@/actions/classification/get-classifications-list.action";
import { getCommuneByWilaya } from "@/actions/commune/get-commune-by-wilaya";
import { getAgentListAction } from "@/actions/users/get-agents-list.action";
import { getWilayaListAction } from "@/actions/wilayas/get-wilaya-list.action";
import InputSelectField from "@/components/custom-inputs/input-select";
import CustomButton from "@/components/ui/custom-button";
import FilterDrawer from "@/components/ui/filter-drawer";
import { Form } from "@/components/ui/form";
import useFetch from "@/hooks/use-fetch.hook";
import { TRANSLATIONS_KEYS_2 } from "@/i18n/translation-keys";
import { BienFilterForm, BienFilterFormSchema } from "@/schemas/biens/bien-filter-form.schema";
import { ListItem } from "@/schemas/global.schema";
import { CATEGORIES, SCOPES } from "@/services/classification.service";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";

export default function BienFilter() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const searchParams = useSearchParams();
  const translation = useTranslations();
  const router = useRouter();

  const [isFiltering, startFilteringTransition] = useTransition();

  const getInitialValues = (): Partial<BienFilterForm> => {
    const params = new URLSearchParams(searchParams);
    const initialValues: any = {};
    ["wilaya_id", "commune_id", "bien_type_id", "transaction_type_id", "bien_status_id", "agent_id"].forEach((key) => {
      const val = params.get(key);
      if (val) initialValues[key] = val;
    });
    return initialValues;
  };

  const form = useForm<BienFilterForm>({
    resolver: zodResolver(BienFilterFormSchema),
    defaultValues: getInitialValues(),
  });

  const selectedWilayaId = form.watch("wilaya_id");

  const [wilayas, isWilayasPending] = useFetch<ListItem[]>(async () => await getWilayaListAction(), [], isOpen);
  const [communes, isCommunesPending] = useFetch<ListItem[]>(
    async () => await getCommuneByWilaya(selectedWilayaId || ""),
    [],
    !!(isOpen && selectedWilayaId),
  );
  const [agents, isAgentsPending] = useFetch<ListItem[]>(async () => await getAgentListAction(), [], isOpen);
  const [types, isTypesPendings] = useFetch<ListItem[]>(
    async () => await getClassificationsListAction(CATEGORIES.TYPE, SCOPES.BIEN),
    [],
    isOpen,
  );
  const [transactionTypes, isTransactionTypesPendings] = useFetch<ListItem[]>(
    async () => await getClassificationsListAction(CATEGORIES.TYPE, SCOPES.TRANSACTION),
    [],
    isOpen,
  );
  const [statuses, isStatusesPendings] = useFetch<ListItem[]>(
    async () => await getClassificationsListAction(CATEGORIES.STATUS, SCOPES.BIEN),
    [],
    isOpen,
  );

  useEffect(() => {
    if (isOpen) form.reset(getInitialValues());
  }, [searchParams, isOpen]);

  const hasActiveFilters = () => {
    const params = new URLSearchParams(searchParams);
    const filterKeys = ["wilaya_id", "commune_id", "bien_type_id", "bien_status_id", "agent_id", "transaction_type_id"];
    return Array.from(params.keys()).some((key) => filterKeys.includes(key));
  };

  async function onSubmit(values: BienFilterForm) {
    const params = new URLSearchParams();
    Object.entries(values).forEach(([key, value]) => {
      if (value && value !== "") {
        params.append(key, value.toString());
      }
    });

    startFilteringTransition(() => {
      router.push(`?${params.toString()}`);
      setIsOpen(false);
    });
  }

  function handleClearFilters() {
    startFilteringTransition(() => {
      form.reset({});
      router.push(window.location.pathname);
      setIsOpen(false);
    });
  }

  return (
    <FilterDrawer
      buttonText={translation(TRANSLATIONS_KEYS_2.COMMON.BUTTONS.FILTER)}
      title={translation(TRANSLATIONS_KEYS_2.BIENS.FILTER.TITLE)}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 p-5">
          <div className="space-y-2">
            <InputSelectField
              control={form.control}
              name="bien_type_id"
              label={translation(TRANSLATIONS_KEYS_2.BIENS.FILTER.LABELS.BIEN_TYPE)}
              options={types}
              isPending={isTypesPendings}
              placeholder={translation(TRANSLATIONS_KEYS_2.BIENS.FILTER.PLACEHOLDERS.BIEN_TYPE)}
            />
            <InputSelectField
              control={form.control}
              name="bien_status_id"
              label={translation(TRANSLATIONS_KEYS_2.BIENS.FILTER.LABELS.STATUS)}
              options={statuses}
              isPending={isStatusesPendings}
              placeholder={translation(TRANSLATIONS_KEYS_2.BIENS.FILTER.PLACEHOLDERS.STATUS)}
            />
            <InputSelectField
              control={form.control}
              name="transaction_type_id"
              label={translation(TRANSLATIONS_KEYS_2.BIENS.FILTER.LABELS.TRANSACTION_TYPE)}
              options={transactionTypes}
              isPending={isTransactionTypesPendings}
              placeholder={translation(TRANSLATIONS_KEYS_2.BIENS.FILTER.PLACEHOLDERS.TRANSACTION_TYPE)}
            />
            <InputSelectField
              control={form.control}
              name="wilaya_id"
              label={translation(TRANSLATIONS_KEYS_2.BIENS.FILTER.LABELS.WILAYA)}
              options={wilayas}
              isPending={isWilayasPending}
              placeholder={translation(TRANSLATIONS_KEYS_2.BIENS.FILTER.PLACEHOLDERS.WILAYA)}
            />
            <InputSelectField
              control={form.control}
              name="commune_id"
              label={translation(TRANSLATIONS_KEYS_2.BIENS.FILTER.LABELS.COMMUNE)}
              options={communes}
              isPending={isCommunesPending}
              placeholder={translation(TRANSLATIONS_KEYS_2.BIENS.FILTER.PLACEHOLDERS.COMMUNE)}
              disabled={!selectedWilayaId}
            />
            <InputSelectField
              control={form.control}
              name="agent_id"
              label={translation(TRANSLATIONS_KEYS_2.BIENS.FILTER.LABELS.AGENT)}
              options={agents}
              isPending={isAgentsPending}
              placeholder={translation(TRANSLATIONS_KEYS_2.BIENS.FILTER.PLACEHOLDERS.AGENT)}
            />
          </div>

          <div className="flex flex-col gap-2 mt-6">
            <CustomButton
              text={translation(TRANSLATIONS_KEYS_2.COMMON.BUTTONS.APPLY)}
              type="submit"
              isPending={isFiltering}
              disabled={isFiltering}
            />
            <CustomButton
              text={translation(TRANSLATIONS_KEYS_2.COMMON.BUTTONS.CLEAR_FILTERS)}
              type="button"
              variant="outline"
              onClick={handleClearFilters}
              isPending={isFiltering}
              disabled={!hasActiveFilters() || isFiltering}
            />
          </div>
        </form>
      </Form>
    </FilterDrawer>
  );
}

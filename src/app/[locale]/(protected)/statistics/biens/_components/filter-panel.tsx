"use client";

import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import useFetch from "@/hooks/use-fetch.hook";
import { ListItem } from "@/schemas/global.schema";
import { getCommuneByWilaya } from "@/actions/commune/get-commune-by-wilaya";
import { getWilayaListAction } from "@/actions/wilayas/get-wilaya-list.action";
import { useForm } from "react-hook-form";
import { BienFilterForm } from "@/schemas/biens/bien-filter-form.schema";
import { BienFilterFormStats, BienFilterFormStatsSchema } from "@/schemas/biens/bien-filter-stats-form.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { getClassificationsListAction } from "@/actions/classification/get-classifications-list.action";
import { CATEGORIES, SCOPES } from "@/services/classification.service";
import { Form } from "@/components/ui/form";
import InputSelectField from "@/components/custom-inputs/input-select";
import { TRANSLATIONS_KEYS_2 } from "@/i18n/translation-keys";
import CustomButton from "@/components/ui/custom-button";

export function FilterPanel() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const translation = useTranslations();
  const router = useRouter();

  const periods: ListItem[] = [
    {
      id: "week",
      name: "Semaine",
    },
    {
      id: "month",
      name: "Mois",
    },
    {
      id: "year",
      name: "Année",
    },
  ];

  const exclusivities: ListItem[] = [
    {
      id: "yes",
      name: "Oui",
    },
    {
      id: "no",
      name: "Non",
    },
  ];

  const [isFiltering, startFilteringTransition] = useTransition();

  const getInitialValues = (): Partial<BienFilterForm> => {
    const params = new URLSearchParams(searchParams);
    const initialValues: any = {};
    ["wilaya_id", "commune_id", "bien_type_id", "period", "exclusivity"].forEach((key) => {
      const val = params.get(key);
      if (val) initialValues[key] = val;
    });
    return initialValues;
  };

  const form = useForm<BienFilterFormStats>({
    resolver: zodResolver(BienFilterFormStatsSchema),
    defaultValues: {
      bien_type_id: params.get("bien_type_id") || undefined,
      wilaya_id: params.get("wilaya_id") || undefined,
      commune_id: params.get("commune_id") || undefined,
      period: (params.get("period") || "year") as "year" | "month" | "week",
      exclusivity: (params.get("exclusivity") || undefined) as "yes" | "no",
    },
  });

  const selectedWilayaId = form.watch("wilaya_id");

  const [wilayas, isWilayasPending] = useFetch<ListItem[]>(async () => await getWilayaListAction(), []);
  const [communes, isCommunesPending] = useFetch<ListItem[]>(
    async () => await getCommuneByWilaya(selectedWilayaId || ""),
    [],
    !!selectedWilayaId,
  );
  const [types, isTypesPendings] = useFetch<ListItem[]>(
    async () => await getClassificationsListAction(CATEGORIES.TYPE, SCOPES.BIEN),
    [],
    isOpen,
  );

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

  const hasActiveFilters = () => {
    const params = new URLSearchParams(searchParams);
    const filterKeys = ["wilaya_id", "commune_id", "bien_type_id", "period", "exclusivity"];
    return Array.from(params.keys()).some((key) => filterKeys.includes(key));
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 p-5">
        <div className="space-y-2">
          <InputSelectField
            control={form.control}
            name="period"
            label="select a period"
            options={periods}
            placeholder="period"
          />
          <InputSelectField
            control={form.control}
            name="bien_type_id"
            options={types}
            isPending={isTypesPendings}
            label={translation(TRANSLATIONS_KEYS_2.BIENS.FILTER.LABELS.BIEN_TYPE)}
            placeholder={translation(TRANSLATIONS_KEYS_2.BIENS.FILTER.PLACEHOLDERS.BIEN_TYPE)}
          />
          <InputSelectField
            control={form.control}
            name="wilaya_id"
            options={wilayas}
            isPending={isWilayasPending}
            label={translation(TRANSLATIONS_KEYS_2.BIENS.FILTER.LABELS.WILAYA)}
            placeholder={translation(TRANSLATIONS_KEYS_2.BIENS.FILTER.PLACEHOLDERS.WILAYA)}
          />
          <InputSelectField
            control={form.control}
            name="commune_id"
            options={communes}
            isPending={isCommunesPending}
            disabled={!selectedWilayaId}
            label={translation(TRANSLATIONS_KEYS_2.BIENS.FILTER.LABELS.COMMUNE)}
            placeholder={translation(TRANSLATIONS_KEYS_2.BIENS.FILTER.PLACEHOLDERS.COMMUNE)}
          />
          <InputSelectField
            control={form.control}
            name="exclusivity"
            options={exclusivities}
            label={translation(TRANSLATIONS_KEYS_2.BIENS.FORM.LABELS.IS_EXCLUSIVE)}
            placeholder={translation(TRANSLATIONS_KEYS_2.BIENS.FORM.LABELS.IS_EXCLUSIVE)}
          />
        </div>

        <div className="flex  gap-2 mt-6">
          <CustomButton
            text={translation(TRANSLATIONS_KEYS_2.COMMON.BUTTONS.CLEAR_FILTERS)}
            type="button"
            variant="ghost"
            onClick={handleClearFilters}
            isPending={isFiltering}
            disabled={!hasActiveFilters() || isFiltering}
            className="flex-1"
          />
          <CustomButton
            text={translation(TRANSLATIONS_KEYS_2.COMMON.BUTTONS.FILTER)}
            type="submit"
            isPending={isFiltering}
            disabled={isFiltering}
            className="flex-1"
          />
        </div>
      </form>
    </Form>
  );
}

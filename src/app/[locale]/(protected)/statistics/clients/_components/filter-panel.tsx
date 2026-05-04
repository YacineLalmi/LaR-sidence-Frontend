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
import { ClientFilterStatsForm, ClientFilterStatsFormSchema } from "@/schemas/clients/client-filter-stats-form.schema";

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

  const civilities: ListItem[] = [
    {
      id: "mrs",
      name: "Female",
    },
    {
      id: "mr",
      name: "Male",
    },
    {
      id: "company",
      name: "Company",
    },
  ];

  const [isFiltering, startFilteringTransition] = useTransition();

  const form = useForm<ClientFilterStatsForm>({
    resolver: zodResolver(ClientFilterStatsFormSchema),
    defaultValues: {
      period: (params.get("period") || "year") as "year" | "month" | "week",
      civility: (params.get("civility") || "mr") as "mr" | "mrs" | "company",
    },
  });

  async function onSubmit(values: ClientFilterStatsForm) {
    const params = new URLSearchParams();
    Object.entries(values).forEach(([key, value]) => {
      if (value) {
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
    const filterKeys = ["period", "civility"];
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
            name="civility"
            options={civilities}
            label={translation(TRANSLATIONS_KEYS_2.CLIENTS.FORM.LABELS.CIVILITY)}
            placeholder={translation(TRANSLATIONS_KEYS_2.CLIENTS.FORM.PLACEHOLDERS.CIVILITY)}
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

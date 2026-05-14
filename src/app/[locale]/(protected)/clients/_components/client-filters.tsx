"use client";

import { getClassificationsListAction } from "@/actions/classification/get-classifications-list.action";
import { InputDateRangeField } from "@/components/custom-inputs/input-range";
import InputSelectField from "@/components/custom-inputs/input-select";
import CustomButton from "@/components/ui/custom-button";
import FilterDrawer from "@/components/ui/filter-drawer";
import { Form } from "@/components/ui/form";
import useFetch from "@/hooks/use-fetch.hook";
import { TRANSLATIONS_KEYS_2 } from "@/i18n/translation-keys";
import { customToast } from "@/lib/utils";
import { ClientFilterForm, ClientFilterFormSchema } from "@/schemas/clients/client-filter-form.schema";
import { ListItem } from "@/schemas/global.schema";
import { CATEGORIES, SCOPES } from "@/services/classification.service";
import { zodResolver } from "@hookform/resolvers/zod";
import { format, parse } from "date-fns";
import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";

export default function ClientFilters() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const searchParams = useSearchParams();
  const translation = useTranslations();
  const router = useRouter();

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

  const [types, isTypesLoading] = useFetch<ListItem[]>(
    async () => await getClassificationsListAction(CATEGORIES.TYPE, SCOPES.CLEINT),
    [],
    isOpen,
  );
  const [statuses, isStatuesLoading] = useFetch<ListItem[]>(
    async () => await getClassificationsListAction(CATEGORIES.STATUS, SCOPES.CLEINT),
    [],
    isOpen,
  );
  const [sources, isSourcesLoading] = useFetch<ListItem[]>(
    async () => await getClassificationsListAction(CATEGORIES.SOURCE, SCOPES.CLEINT),
    [],
    isOpen,
  );

  // Parse query params to get initial values
  const getInitialValues = (): Partial<ClientFilterForm> => {
    const params = new URLSearchParams(searchParams);
    const initialValues: any = {};

    ["civility", "type_id", "status_id", "source_id"].forEach((key) => {
      const val = params.get(key);
      if (val) initialValues[key] = val;
    });

    // Handle date range
    const created_between = params.get("created_between");
    if (created_between) {
      const [fromStr, toStr] = created_between.split(",");

      const dateRange: any = {};

      if (fromStr) {
        try {
          dateRange.from = parse(fromStr, "yyyy-MM-dd", new Date());
        } catch (e) {
          console.error("Error parsing from date:", e);
        }
      }

      if (toStr) {
        try {
          dateRange.to = parse(toStr, "yyyy-MM-dd", new Date());
        } catch (e) {
          console.error("Error parsing to date:", e);
        }
      }

      if (dateRange.from || dateRange.to) {
        initialValues.created_between = dateRange;
      }
    }

    return initialValues;
  };

  const form = useForm<ClientFilterForm>({
    resolver: zodResolver(ClientFilterFormSchema),
    defaultValues: getInitialValues(),
  });

  // Update form when search params change
  useEffect(() => {
    const initialValues = getInitialValues();
    form.reset(initialValues);
  }, [searchParams]);

  // Check if any filters are active
  const hasActiveFilters = () => {
    const params = new URLSearchParams(searchParams);
    return Array.from(params.keys()).some((key) =>
      ["civility", "type_id", "status_id", "source_id", "created_between"].includes(key),
    );
  };

  async function onSubmit(values: ClientFilterForm) {
    const params = new URLSearchParams();

    Object.entries(values).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== "") {
        // Handle date range fields
        if (typeof value === "object" && "from" in value) {
          const { from, to } = value;
          const fromDate = from ? format(from, "yyyy-MM-dd") : "";
          const toDate = to ? format(to, "yyyy-MM-dd") : "";

          // Only add if at least one date is selected
          if (fromDate || toDate) {
            params.append(key, `${fromDate},${toDate}`);
          }
        } else {
          // Handle regular fields
          params.append(key, value.toString());
        }
      }
    });

    router.push(`?${params.toString()}`);
    setIsOpen(false);
  }

  function handleClearFilters() {
    form.reset({});
    router.push(window.location.pathname);
    setIsOpen(false);
    customToast.success(translation(TRANSLATIONS_KEYS_2.COMMON.MESSAGES.OPERATION_COMPLETED));
  }

  return (
    <FilterDrawer
      buttonText={translation(TRANSLATIONS_KEYS_2.COMMON.BUTTONS.FILTER)}
      title={translation(TRANSLATIONS_KEYS_2.CLIENTS.FILTER.TITLE)}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
    >
      <Form {...form}>
        <form id="client-filter-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-2 p-5">
          <InputSelectField
            control={form.control}
            name="civility"
            options={civilities}
            label={translation(TRANSLATIONS_KEYS_2.CLIENTS.FILTER.LABELS.GENDER)}
            placeholder={translation(TRANSLATIONS_KEYS_2.CLIENTS.FILTER.PLACEHOLDERS.GENDER)}
          />
          <InputSelectField
            control={form.control}
            name="type_id"
            options={types}
            isPending={isTypesLoading}
            label={translation(TRANSLATIONS_KEYS_2.CLIENTS.FILTER.LABELS.TYPE)}
            placeholder={translation(TRANSLATIONS_KEYS_2.CLIENTS.FILTER.PLACEHOLDERS.TYPE)}
          />
          <InputSelectField
            control={form.control}
            name="status_id"
            options={statuses}
            isPending={isStatuesLoading}
            label={translation(TRANSLATIONS_KEYS_2.CLIENTS.FILTER.LABELS.STATUS)}
            placeholder={translation(TRANSLATIONS_KEYS_2.CLIENTS.FILTER.PLACEHOLDERS.STATUS)}
          />
          <InputSelectField
            control={form.control}
            name="source_id"
            options={sources}
            isPending={isSourcesLoading}
            label={translation(TRANSLATIONS_KEYS_2.CLIENTS.FILTER.LABELS.SOURCE)}
            placeholder={translation(TRANSLATIONS_KEYS_2.CLIENTS.FILTER.PLACEHOLDERS.SOURCE)}
          />
          <InputDateRangeField
            control={form.control}
            name="created_between"
            label={translation(TRANSLATIONS_KEYS_2.CLIENTS.FILTER.LABELS.CREATED_BETWEEN)}
            placeholder={translation(TRANSLATIONS_KEYS_2.CLIENTS.FILTER.PLACEHOLDERS.CREATED_BETWEEN)}
          />

          {/* Action Buttons */}
          <div className="flex flex-col gap-2 mt-5">
            <CustomButton text={translation(TRANSLATIONS_KEYS_2.COMMON.BUTTONS.APPLY)} type="submit" />
            <CustomButton
              text={translation(TRANSLATIONS_KEYS_2.COMMON.BUTTONS.CLEAR_FILTERS)}
              type="button"
              variant="outline"
              onClick={handleClearFilters}
              disabled={!hasActiveFilters()}
            />
          </div>
        </form>
      </Form>
    </FilterDrawer>
  );
}

"use client";

import { InputDateRangeField } from "@/components/custom-inputs/input-range";
import InputSelectField from "@/components/custom-inputs/input-select";
import { Button } from "@/components/ui/button";
import CustomButton from "@/components/ui/custom-button";
import FilterDrawer from "@/components/ui/filter-drawer";
import { Form } from "@/components/ui/form";
import { TRANSLATIONS_KEYS } from "@/i18n/translation-constants";
import { customToast } from "@/lib/utils";
import { ClientFilterForm, ClientFilterFormSchema } from "@/schemas/clients/client-filter-form.schema";
import { ListItem } from "@/schemas/global.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { format, parse } from "date-fns";
import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

interface Props {
  types: ListItem[];
  status: ListItem[];
  sources: ListItem[];
  civilities: ListItem[];
}

export default function ClientFilters({ types, status, sources, civilities }: Props) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const searchParams = useSearchParams();
  const translation = useTranslations();
  const router = useRouter();

  // Parse query params to get initial values
  const getInitialValues = (): Partial<ClientFilterForm> => {
    const params = new URLSearchParams(searchParams);
    const initialValues: any = {};

    // Handle regular fields
    const civility = params.get("civility");
    if (civility) initialValues.civility = civility;

    const type_id = params.get("type_id");
    if (type_id) initialValues.type_id = type_id;

    const status_id = params.get("status_id");
    if (status_id) initialValues.status_id = status_id;

    const source_id = params.get("source_id");
    if (source_id) initialValues.source_id = source_id;

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
      ["civility", "type_id", "status_id", "source_id", "created_between"].includes(key)
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

  async function onInvalid(values: any) {
    const [field, error] = Object.entries(values)[0] as [string, { message: string }];
    customToast.error(`${field}: ${error.message}`);
  }

  function handleClearFilters() {
    // Reset the form
    form.reset({});

    // Clear all query parameters by navigating to the base path
    router.push(window.location.pathname);

    // Close the drawer
    setIsOpen(false);

    // Optional: Show success message
    customToast.success(translation(TRANSLATIONS_KEYS.COMMON.CLEAR_FILTERS));
  }

  return (
    <FilterDrawer
      buttonText={translation(TRANSLATIONS_KEYS.COMMON.FILTER)}
      title={translation(TRANSLATIONS_KEYS.CLIENTS.FILTER.TITLE)}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
    >
      <Form {...form}>
        <form id="client-filter-form" onSubmit={form.handleSubmit(onSubmit, onInvalid)} className="space-y-2 p-5">
          <InputSelectField
            control={form.control}
            name="civility"
            options={civilities}
            label={translation(TRANSLATIONS_KEYS.CLIENTS.FILTER.LABEL.GENDER)}
            placeholder={translation(TRANSLATIONS_KEYS.CLIENTS.FILTER.PLACEHOLDER.GENDER)}
          />
          <InputSelectField
            control={form.control}
            name="type_id"
            options={types}
            label={translation(TRANSLATIONS_KEYS.CLIENTS.FILTER.LABEL.TYPE)}
            placeholder={translation(TRANSLATIONS_KEYS.CLIENTS.FILTER.PLACEHOLDER.TYPE)}
          />
          <InputSelectField
            control={form.control}
            name="status_id"
            options={status}
            label={translation(TRANSLATIONS_KEYS.CLIENTS.FILTER.LABEL.STATUS)}
            placeholder={translation(TRANSLATIONS_KEYS.CLIENTS.FILTER.PLACEHOLDER.STATUS)}
          />
          <InputSelectField
            control={form.control}
            name="source_id"
            options={sources}
            label={translation(TRANSLATIONS_KEYS.CLIENTS.FILTER.LABEL.SOURCE)}
            placeholder={translation(TRANSLATIONS_KEYS.CLIENTS.FILTER.PLACEHOLDER.SOURCE)}
          />
          <InputDateRangeField
            control={form.control}
            name="created_between"
            label={translation(TRANSLATIONS_KEYS.CLIENTS.FILTER.LABEL.SOURCE)}
            placeholder={translation(TRANSLATIONS_KEYS.CLIENTS.FILTER.PLACEHOLDER.SOURCE)}
          />

          {/* Action Buttons */}
          <div className="flex flex-col gap-2 mt-5">
            <CustomButton text={translation(TRANSLATIONS_KEYS.COMMON.APPLY)} type="submit" />
            <CustomButton
              text={translation(TRANSLATIONS_KEYS.COMMON.CLEAR_FILTERS)}
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

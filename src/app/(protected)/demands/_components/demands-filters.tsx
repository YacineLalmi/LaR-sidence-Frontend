"use client";

import { InputDateRangeField } from "@/components/custom-inputs/input-range";
import InputSelectField from "@/components/custom-inputs/input-select";
import InputTextField from "@/components/custom-inputs/input-text";
import CustomButton from "@/components/ui/custom-button";
import FilterDrawer from "@/components/ui/filter-drawer";
import { Form } from "@/components/ui/form";
import { TRANSLATIONS_KEYS_2 } from "@/i18n/translation-keys";
import { customToast } from "@/lib/utils";
import { DemandFilterForm, DemandFilterFormSchema } from "@/schemas/demands/demand-filters-form.schema";
import { ListItem } from "@/schemas/global.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { format, parse } from "date-fns";
import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

interface Props {
  types: ListItem[];
  status: ListItem[];
  priorities: ListItem[];
  sources: ListItem[];
  clients: ListItem[];
  biens: ListItem[];
  agents: ListItem[];
}

export default function DemandsFilters({ types, status, priorities, sources, clients, biens, agents }: Props) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const translation = useTranslations();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Parse query params to get initial values
  const getInitialValues = (): Partial<DemandFilterForm> => {
    const params = new URLSearchParams(searchParams);
    const initialValues: any = {};

    // Handle regular fields
    const status_id = params.get("status_id");
    if (status_id) initialValues.status_id = status_id;

    const type_id = params.get("type_id");
    if (type_id) initialValues.type_id = type_id;

    const client_id = params.get("client_id");
    if (client_id) initialValues.client_id = client_id;

    const agent_id = params.get("agent_id");
    if (agent_id) initialValues.agent_id = agent_id;

    // Handle budget range
    const budget_between = params.get("budget_between");
    if (budget_between) {
      const [fromStr, toStr] = budget_between.split(",");

      const budgetRange: any = {};

      if (fromStr) {
        budgetRange.from = fromStr;
      }

      if (toStr) {
        budgetRange.to = toStr;
      }

      if (budgetRange.from || budgetRange.to) {
        initialValues.budget_between = budgetRange;
      }
    }

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

  const form = useForm<DemandFilterForm>({
    resolver: zodResolver(DemandFilterFormSchema),
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
    // Check for filter-related params
    return Array.from(params.keys()).some((key) =>
      ["status_id", "type_id", "client_id", "agent_id", "budget_between", "created_between"].includes(key),
    );
  };

  async function onSubmit(values: DemandFilterForm) {
    const params = new URLSearchParams();

    Object.entries(values).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== "") {
        // Handle budget range fields
        if (key === "budget_between" && typeof value === "object" && ("from" in value || "to" in value)) {
          const { from, to } = value;
          const fromBudget = from || "";
          const toBudget = to || "";

          // Only add if at least one budget is selected
          if (fromBudget || toBudget) {
            params.append(key, `${fromBudget},${toBudget}`);
          }
        }
        // Handle date range fields
        else if (typeof value === "object" && "from" in value) {
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
    customToast.success(translation(TRANSLATIONS_KEYS_2.COMMON.MESSAGES.OPERATION_COMPLETED));
  }

  return (
    <FilterDrawer
      buttonText={translation(TRANSLATIONS_KEYS_2.COMMON.BUTTONS.FILTER)}
      title={translation(TRANSLATIONS_KEYS_2.DEMANDS.FILTER.TITLE)}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
    >
      <Form {...form}>
        <form id="demand-filter-form" onSubmit={form.handleSubmit(onSubmit, onInvalid)} className="space-y-2 p-5">
          <InputSelectField
            control={form.control}
            name="status_id"
            options={status}
            label={translation(TRANSLATIONS_KEYS_2.DEMANDS.FILTER.LABELS.STATUS)}
            placeholder={translation(TRANSLATIONS_KEYS_2.DEMANDS.FILTER.PLACEHOLDERS.STATUS)}
          />
          <InputSelectField
            control={form.control}
            name="type_id"
            options={types}
            label={translation(TRANSLATIONS_KEYS_2.DEMANDS.FILTER.LABELS.TYPE)}
            placeholder={translation(TRANSLATIONS_KEYS_2.DEMANDS.FILTER.PLACEHOLDERS.TYPE)}
          />
          <InputSelectField
            control={form.control}
            name="client_id"
            options={clients}
            label={translation(TRANSLATIONS_KEYS_2.DEMANDS.FILTER.LABELS.CLIENT)}
            placeholder={translation(TRANSLATIONS_KEYS_2.DEMANDS.FILTER.PLACEHOLDERS.CLIENT)}
          />
          <InputSelectField
            control={form.control}
            name="agent_id"
            options={agents}
            label={translation(TRANSLATIONS_KEYS_2.DEMANDS.FILTER.LABELS.AGENT)}
            placeholder={translation(TRANSLATIONS_KEYS_2.DEMANDS.FILTER.PLACEHOLDERS.AGENT)}
          />

          {/* Budget Range Fields */}
          <div className="grid grid-cols-2 gap-2">
            <InputTextField
              control={form.control}
              name="budget_between.from"
              label={translation(TRANSLATIONS_KEYS_2.DEMANDS.FILTER.LABELS.BUDGET_MIN)}
              placeholder={translation(TRANSLATIONS_KEYS_2.DEMANDS.FILTER.PLACEHOLDERS.BUDGET_MIN)}
            />
            <InputTextField
              control={form.control}
              name="budget_between.to"
              label={translation(TRANSLATIONS_KEYS_2.DEMANDS.FILTER.LABELS.BUDGET_MAX)}
              placeholder={translation(TRANSLATIONS_KEYS_2.DEMANDS.FILTER.PLACEHOLDERS.BUDGET_MAX)}
            />
          </div>
          <InputDateRangeField
            control={form.control}
            name="created_between"
            label={translation(TRANSLATIONS_KEYS_2.DEMANDS.FILTER.LABELS.CREATED_BETWEEN)}
            placeholder={translation(TRANSLATIONS_KEYS_2.DEMANDS.FILTER.PLACEHOLDERS.CREATED_BETWEEN)}
          />

          {/* Action Buttons */}
          <div className="flex flex-col gap-2 mt-5">
            <CustomButton text={translation(TRANSLATIONS_KEYS_2.DEMANDS.FILTER.BUTTONS.SUBMIT)} type="submit" />
            <CustomButton
              text={translation(TRANSLATIONS_KEYS_2.DEMANDS.FILTER.BUTTONS.CLEAR)}
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

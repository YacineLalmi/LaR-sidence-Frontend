"use client";

import { getClassificationsListAction } from "@/actions/classification/get-classifications-list.action";
import { getClientListAction } from "@/actions/clients/get-client-list.action";
import { getAgentListAction } from "@/actions/users/get-agents-list.action";
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
import { CATEGORIES, SCOPES } from "@/services/classification.service";
import { zodResolver } from "@hookform/resolvers/zod";
import { format, parse } from "date-fns";
import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";

export default function DemandsFilters() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const translation = useTranslations();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [types, setTypes] = useState<ListItem[]>([]);
  const [statuses, setStatuses] = useState<ListItem[]>([]);
  const [agents, setAgents] = useState<ListItem[]>([]);
  const [clients, setClients] = useState<ListItem[]>([]);
  const [isTypesPending, startTypesTransition] = useTransition();
  const [isStatuesPending, startStatuesTransition] = useTransition();
  const [isAgentsPending, startAgentsTransition] = useTransition();
  const [isClientsPending, startClientsTransition] = useTransition();

  // fetching types
  useEffect(() => {
    if (!isOpen) return;

    startTypesTransition(async () => {
      try {
        const results = await getClassificationsListAction(CATEGORIES.TYPE, SCOPES.DEMAND);
        setTypes(results);
      } catch (error) {
        console.error("Failed to fetch options:", error);
        setTypes([]);
      }
    });
    startStatuesTransition(async () => {
      try {
        const results = await getClassificationsListAction(CATEGORIES.STATUS, SCOPES.DEMAND);
        setStatuses(results);
      } catch (error) {
        console.error("Failed to fetch options:", error);
        setStatuses([]);
      }
    });
    startAgentsTransition(async () => {
      try {
        const results = await getAgentListAction();
        setAgents(results);
      } catch (error) {
        console.error("Failed to fetch options:", error);
        setAgents([]);
      }
    });
    startClientsTransition(async () => {
      try {
        const results = await getClientListAction();
        setClients(results);
      } catch (error) {
        console.error("Failed to fetch options:", error);
        setClients([]);
      }
    });
  }, [isOpen]);
  // Parse query params to get initial values
  const getInitialValues = (): Partial<DemandFilterForm> => {
    const params = new URLSearchParams(searchParams);
    const initialValues: any = {};

    ["bien_id", "type_id", "status_id", "client_id", "agent_id"].forEach((key) => {
      const val = params.get(key);
      if (val) initialValues[key] = val;
    });

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
            options={statuses}
            isPending={isStatuesPending}
            label={translation(TRANSLATIONS_KEYS_2.DEMANDS.FILTER.LABELS.STATUS)}
            placeholder={translation(TRANSLATIONS_KEYS_2.DEMANDS.FILTER.PLACEHOLDERS.STATUS)}
          />
          <InputSelectField
            control={form.control}
            name="type_id"
            options={types}
            isPending={isTypesPending}
            label={translation(TRANSLATIONS_KEYS_2.DEMANDS.FILTER.LABELS.TYPE)}
            placeholder={translation(TRANSLATIONS_KEYS_2.DEMANDS.FILTER.PLACEHOLDERS.TYPE)}
          />
          <InputSelectField
            control={form.control}
            name="client_id"
            options={clients}
            isPending={isClientsPending}
            label={translation(TRANSLATIONS_KEYS_2.DEMANDS.FILTER.LABELS.CLIENT)}
            placeholder={translation(TRANSLATIONS_KEYS_2.DEMANDS.FILTER.PLACEHOLDERS.CLIENT)}
          />
          <InputSelectField
            control={form.control}
            name="agent_id"
            options={agents}
            isPending={isAgentsPending}
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

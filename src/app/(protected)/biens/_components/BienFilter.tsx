"use client";

import { getClassificationsListAction } from "@/actions/classification/get-classifications-list.action";
import { getCommuneByWilaya } from "@/actions/commune/get-commune-by-wilaya";
import { getAgentListAction } from "@/actions/users/get-agents-list.action";
import { getWilayaListAction } from "@/actions/wilayas/get-wilaya-list.action";
import InputSelectField from "@/components/custom-inputs/input-select";
import CustomButton from "@/components/ui/custom-button";
import FilterDrawer from "@/components/ui/filter-drawer";
import { Form } from "@/components/ui/form";
import { TRANSLATIONS_KEYS_2 } from "@/i18n/translation-keys";
import { customToast } from "@/lib/utils";
import { BienFilterForm, BienFilterFormSchema } from "@/schemas/biens/bien-filter-form.schema";
import { ListItem } from "@/schemas/global.schema";
import { CATEGORIES, SCOPES } from "@/services/classification.service";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

export default function BienFilter() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const searchParams = useSearchParams();
  const translation = useTranslations();
  const router = useRouter();

  // State for Select options
  const [options, setOptions] = useState<{
    wilayas: ListItem[];
    communes: ListItem[];
    agents: ListItem[];
    bienTypes: ListItem[];
    transactionTypes: ListItem[];
    status: ListItem[];
  }>({
    wilayas: [],
    communes: [],
    agents: [],
    bienTypes: [],
    transactionTypes: [],
    status: [],
  });

  // 1. Parse Initial Values from URL
  const getInitialValues = (): Partial<BienFilterForm> => {
    const params = new URLSearchParams(searchParams);
    return {
      wilaya_id: params.get("wilaya_id") || undefined,
      commune_id: params.get("commune_id") || undefined,
      bien_type_id: params.get("bien_type_id") || undefined,
      transaction_type_id: params.get("transaction_type_id") || undefined,
      bien_status_id: params.get("bien_status_id") || undefined,
      agent_id: params.get("agent_id") || undefined,
    };
  };

  const form = useForm<BienFilterForm>({
    resolver: zodResolver(BienFilterFormSchema),
    defaultValues: getInitialValues(),
  });

  const selectedWilayaId = form.watch("wilaya_id");

  // 2. Fetch Static Lists on Mount
  useEffect(() => {
    const fetchLists = async () => {
      const [w, a, t, tr, s] = await Promise.all([
        getWilayaListAction(),
        getAgentListAction(),
        getClassificationsListAction(CATEGORIES.TYPE, SCOPES.BIEN),
        getClassificationsListAction(CATEGORIES.TYPE, SCOPES.TRANSACTION),
        getClassificationsListAction(CATEGORIES.STATUS, SCOPES.BIEN),
      ]);
      setOptions((prev) => ({
        ...prev,
        wilayas: w,
        agents: a,
        bienTypes: t,
        transactionTypes: tr,
        status: s,
      }));
    };
    fetchLists();
  }, []);

  // 3. Handle Dynamic Communes
  useEffect(() => {
    if (selectedWilayaId) {
      getCommuneByWilaya(selectedWilayaId).then((data) => {
        setOptions((prev) => ({ ...prev, communes: data }));
        // Only set commune_id from URL if it's the first load or matches current wilaya
        const urlCommune = searchParams.get("commune_id");
        if (urlCommune) form.setValue("commune_id", urlCommune);
      });
    } else {
      setOptions((prev) => ({ ...prev, communes: [] }));
      form.setValue("commune_id", undefined);
    }
  }, [selectedWilayaId, searchParams]);

  // 4. Update form when search params change (Browser back/forward)
  useEffect(() => {
    form.reset(getInitialValues());
  }, [searchParams]);

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
              options={options.bienTypes}
              placeholder={translation(TRANSLATIONS_KEYS_2.BIENS.FILTER.PLACEHOLDERS.BIEN_TYPE)}
            />
            <InputSelectField
              control={form.control}
              name="bien_status_id"
              label={translation(TRANSLATIONS_KEYS_2.BIENS.FILTER.LABELS.STATUS)}
              options={options.status}
              placeholder={translation(TRANSLATIONS_KEYS_2.BIENS.FILTER.PLACEHOLDERS.STATUS)}
            />
            <InputSelectField
              control={form.control}
              name="transaction_type_id"
              label={translation(TRANSLATIONS_KEYS_2.BIENS.FILTER.LABELS.TRANSACTION_TYPE)}
              options={options.transactionTypes}
              placeholder={translation(TRANSLATIONS_KEYS_2.BIENS.FILTER.PLACEHOLDERS.TRANSACTION_TYPE)}
            />
            <InputSelectField
              control={form.control}
              name="wilaya_id"
              label={translation(TRANSLATIONS_KEYS_2.BIENS.FILTER.LABELS.WILAYA)}
              options={options.wilayas}
              placeholder={translation(TRANSLATIONS_KEYS_2.BIENS.FILTER.PLACEHOLDERS.WILAYA)}
            />
            <InputSelectField
              control={form.control}
              name="commune_id"
              label={translation(TRANSLATIONS_KEYS_2.BIENS.FILTER.LABELS.COMMUNE)}
              options={options.communes}
              placeholder={translation(TRANSLATIONS_KEYS_2.BIENS.FILTER.PLACEHOLDERS.COMMUNE)}
              disabled={!selectedWilayaId}
            />
            <InputSelectField
              control={form.control}
              name="agent_id"
              label={translation(TRANSLATIONS_KEYS_2.BIENS.FILTER.LABELS.AGENT)}
              options={options.agents}
              placeholder={translation(TRANSLATIONS_KEYS_2.BIENS.FILTER.PLACEHOLDERS.AGENT)}
            />
          </div>

          <div className="flex flex-col gap-2 mt-6">
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

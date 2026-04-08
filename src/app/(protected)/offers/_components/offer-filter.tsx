"use client";

import { getBienListAction } from "@/actions/Bien/get-biens-list.action";
import { getClassificationsListAction } from "@/actions/classification/get-classifications-list.action";
import { getClientListAction } from "@/actions/clients/get-client-list.action";
import InputSelectField from "@/components/custom-inputs/input-select";
import CustomButton from "@/components/ui/custom-button"; // Switched to CustomButton
import FilterDrawer from "@/components/ui/filter-drawer";
import { Form } from "@/components/ui/form";
import { TRANSLATIONS_KEYS_2 } from "@/i18n/translation-keys";
import { customToast } from "@/lib/utils";
import { ListItem } from "@/schemas/global.schema";
import { OfferFilterForm, OfferFilterFormSchema } from "@/schemas/offers/offer-filter-form.schema";
import { CATEGORIES, SCOPES } from "@/services/classification.service";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";

export default function OffersFilter() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const searchParams = useSearchParams();
  const translation = useTranslations();
  const router = useRouter();
  const [types, setTypes] = useState<ListItem[]>([]);
  const [statuses, setStatuses] = useState<ListItem[]>([]);
  const [biens, setBiens] = useState<ListItem[]>([]);
  const [clients, setClients] = useState<ListItem[]>([]);
  const [isTypesPending, startTypesTransition] = useTransition();
  const [isStatuesPending, startStatuesTransition] = useTransition();
  const [isBiensPending, startBiensTransition] = useTransition();
  const [isClientsPending, startClientsTransition] = useTransition();

  // fetching types
  useEffect(() => {
    if (!open) return;
    startTypesTransition(async () => {
      try {
        const results = await getClassificationsListAction(CATEGORIES.TYPE, SCOPES.OFFER);
        setTypes(results);
      } catch (error) {
        console.error("Failed to fetch options:", error);
        setTypes([]);
      }
    });

    startStatuesTransition(async () => {
      try {
        const results = await getClassificationsListAction(CATEGORIES.STATUS, SCOPES.OFFER);
        setStatuses(results);
      } catch (error) {
        console.error("Failed to fetch options:", error);
        setStatuses([]);
      }
    });

    startBiensTransition(async () => {
      try {
        const results = await getBienListAction();
        setBiens(results);
      } catch (error) {
        console.error("Failed to fetch options:", error);
        setBiens([]);
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
  }, [open]);

  // 1. Parse query params for initial values (keeps sync with URL)
  const getInitialValues = (): Partial<OfferFilterForm> => {
    const params = new URLSearchParams(searchParams);
    const initialValues: any = {};

    ["bien_id", "type_id", "status_id", "client_id"].forEach((key) => {
      const val = params.get(key);
      if (val) initialValues[key] = val;
    });

    return initialValues;
  };

  const form = useForm<OfferFilterForm>({
    resolver: zodResolver(OfferFilterFormSchema),
    defaultValues: getInitialValues(),
  });

  // 2. Sync form when URL changes
  useEffect(() => {
    form.reset(getInitialValues());
  }, [searchParams]);

  // 3. Check if any relevant filters are active
  const hasActiveFilters = () => {
    const params = new URLSearchParams(searchParams);
    return ["bien_id", "type_id", "status_id", "client_id"].some((key) => params.has(key));
  };

  async function onSubmit(values: OfferFilterForm) {
    const params = new URLSearchParams();

    Object.entries(values).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== "") {
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
      title={translation(TRANSLATIONS_KEYS_2.OFFERS.FILTER.TITLE)} // Adjusted title key if needed
      isOpen={isOpen}
      setIsOpen={setIsOpen}
    >
      <Form {...form}>
        <form id="offer-filter-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-2 p-5">
          <InputSelectField
            control={form.control}
            name="bien_id"
            label={translation(TRANSLATIONS_KEYS_2.OFFERS.FORM.LABELS.BIEN)}
            placeholder={translation(TRANSLATIONS_KEYS_2.OFFERS.FORM.PLACEHOLDERS.BIEN)}
            options={biens}
            isPending={isBiensPending}
            required
          />
          <InputSelectField
            control={form.control}
            name="client_id"
            label={translation(TRANSLATIONS_KEYS_2.OFFERS.FORM.LABELS.CLIENT)}
            placeholder={translation(TRANSLATIONS_KEYS_2.OFFERS.FORM.PLACEHOLDERS.CLIENT)}
            options={clients}
            required
            isPending={isClientsPending}
          />
          <InputSelectField
            control={form.control}
            name="type_id"
            label={translation(TRANSLATIONS_KEYS_2.OFFERS.FORM.LABELS.TYPE)}
            placeholder={translation(TRANSLATIONS_KEYS_2.OFFERS.FORM.PLACEHOLDERS.TYPE)}
            options={types}
            required
            isPending={isTypesPending}
          />
          <InputSelectField
            control={form.control}
            name="status_id"
            label={translation(TRANSLATIONS_KEYS_2.OFFERS.FORM.LABELS.STATUS)}
            placeholder={translation(TRANSLATIONS_KEYS_2.OFFERS.FORM.PLACEHOLDERS.STATUS)}
            options={statuses}
            required
            isPending={isStatuesPending}
          />
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

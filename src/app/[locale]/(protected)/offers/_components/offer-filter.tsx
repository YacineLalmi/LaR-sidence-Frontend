"use client";

import { getBienListAction } from "@/actions/Bien/get-biens-list.action";
import { getClassificationsListAction } from "@/actions/classification/get-classifications-list.action";
import { getClientListAction } from "@/actions/clients/get-client-list.action";
import InputSelectField from "@/components/custom-inputs/input-select";
import CustomButton from "@/components/ui/custom-button";
import FilterDrawer from "@/components/ui/filter-drawer";
import { Form } from "@/components/ui/form";
import useFetch from "@/hooks/use-fetch.hook";
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

  const [types, isTypesPending] = useFetch<ListItem[]>(
    async () => await getClassificationsListAction(CATEGORIES.TYPE, SCOPES.OFFER),
    [],
    isOpen,
  );
  const [statuses, isStatuesPending] = useFetch<ListItem[]>(
    async () => await getClassificationsListAction(CATEGORIES.STATUS, SCOPES.OFFER),
    [],
    isOpen,
  );
  const [biens, isBiensPending] = useFetch<ListItem[]>(async () => await getBienListAction(), [], isOpen);
  const [clients, isClientsPending] = useFetch<ListItem[]>(async () => await getClientListAction(), [], isOpen);

  // --- NEW: Transition for Navigation (The Loader) ---
  const [isNavigating, startNavigating] = useTransition();

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

  useEffect(() => {
    if (isOpen) form.reset(getInitialValues());
  }, [searchParams, isOpen]);

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

    startNavigating(() => {
      router.push(`?${params.toString()}`);
      setIsOpen(false);
    });
  }

  function handleClearFilters() {
    startNavigating(() => {
      form.reset({});
      router.push(window.location.pathname);
      setIsOpen(false);
    });
  }

  return (
    <FilterDrawer
      buttonText={translation(TRANSLATIONS_KEYS_2.COMMON.BUTTONS.FILTER)}
      title={translation(TRANSLATIONS_KEYS_2.OFFERS.FILTER.TITLE)}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
    >
      <Form {...form}>
        <form id="offer-filter-form" onSubmit={form.handleSubmit(onSubmit)} className="relative space-y-2 p-5">
          <InputSelectField
            control={form.control}
            name="bien_id"
            label={translation(TRANSLATIONS_KEYS_2.OFFERS.FORM.LABELS.BIEN)}
            options={biens}
            clearable
            isPending={isBiensPending}
          />
          <InputSelectField
            control={form.control}
            name="client_id"
            label={translation(TRANSLATIONS_KEYS_2.OFFERS.FORM.LABELS.CLIENT)}
            options={clients}
            isPending={isClientsPending}
          />
          <InputSelectField
            control={form.control}
            name="type_id"
            label={translation(TRANSLATIONS_KEYS_2.OFFERS.FORM.LABELS.TYPE)}
            options={types}
            isPending={isTypesPending}
          />
          <InputSelectField
            control={form.control}
            name="status_id"
            label={translation(TRANSLATIONS_KEYS_2.OFFERS.FORM.LABELS.STATUS)}
            options={statuses}
            isPending={isStatuesPending}
          />

          <div className="flex flex-col gap-2 mt-5">
            <CustomButton
              text={translation(TRANSLATIONS_KEYS_2.COMMON.BUTTONS.APPLY)}
              type="submit"
              isPending={isNavigating} // Pass isNavigating to your button loader
              disabled={isNavigating}
            />
            <CustomButton
              text={translation(TRANSLATIONS_KEYS_2.COMMON.BUTTONS.CLEAR_FILTERS)}
              type="button"
              variant="outline"
              onClick={handleClearFilters}
              disabled={!hasActiveFilters() || isNavigating}
            />
          </div>
        </form>
      </Form>
    </FilterDrawer>
  );
}

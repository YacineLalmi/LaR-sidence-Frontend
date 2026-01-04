"use client";
import InputSelectField from "@/components/custom-inputs/input-select";
import { Button } from "@/components/ui/button";
import FilterDrawer from "@/components/ui/filter-drawer";
import { Form } from "@/components/ui/form";
import { customToast } from "@/lib/utils";
import { ClientFilterForm, ClientFilterFormSchema } from "@/schemas/clients/client-filter-form.schema";
import { ListItem } from "@/schemas/Global.schema";
import { OfferFilterForm, OfferFilterFormSchema } from "@/schemas/offers/offer-filter-form.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

interface Props {
  biens: ListItem[];
  types: ListItem[];
  clients: ListItem[];
  status: ListItem[];
}

export default function OffersFilter({ types, status, biens, clients }: Props) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const searchParams = useSearchParams();
  const t = useTranslations();

  const router = useRouter();
  const form = useForm<OfferFilterForm>({
    resolver: zodResolver(OfferFilterFormSchema),
    defaultValues: {},
  });

  async function onSubmit(values: ClientFilterForm) {
    const params = new URLSearchParams();

    Object.entries(values).forEach(([key, value]) => {
      if (value) {
        params.append(key, value.toString());
      }
    });

    router.push(`?${params.toString()}`);
    setIsOpen(false);
  }
  async function onInvalid(values: any) {
    const [field, error] = Object.entries(values)[0] as [string, { message: string }];
    customToast.error(`${field}: ${error.message}`);
  }

  useEffect(() => {
    return () => {
      form.reset();
    };
  }, [form]);

  return (
    <FilterDrawer
      buttonText={t("common.filter")}
      title={t("clients.filter.title")}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
    >
      <Form {...form}>
        <form id="login-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-2 p-5">
          <InputSelectField
            control={form.control}
            name="bien_id"
            options={biens}
            label={t("clients.filter.label.gender")}
            placeholder={t("clients.filter.placeholder.gender")}
          />
          <InputSelectField
            control={form.control}
            name="type_id"
            options={types}
            label={t("clients.filter.label.type")}
            placeholder={t("clients.filter.placeholder.type")}
          />
          <InputSelectField
            control={form.control}
            name="status_id"
            options={status}
            label={t("clients.filter.label.status")}
            placeholder={t("clients.filter.placeholder.status")}
          />
          <InputSelectField
            control={form.control}
            name="client_id"
            options={clients}
            label={t("clients.filter.label.source")}
            placeholder={t("clients.filter.placeholder.source")}
          />
          <Button type="submit" className="w-full mt-5">
            {t("biens.filter.submit")}
          </Button>
        </form>
      </Form>
    </FilterDrawer>
  );
}

"use client";
import InputSelectField from "@/components/custom-inputs/input-select";
import { Button } from "@/components/ui/button";
import FilterDrawer from "@/components/ui/filter-drawer";
import { Form } from "@/components/ui/form";
import { customToast } from "@/lib/utils";
import { ClientFilterForm, ClientFilterFormSchema } from "@/schemas/clients/client-filter-form.schema";
import { ListItem } from "@/schemas/Global.schema";
import { zodResolver } from "@hookform/resolvers/zod";
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

export default function ClientFilter({ types, status, sources, civilities }: Props) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const searchParams = useSearchParams();
  const t = useTranslations();

  const router = useRouter();
  const form = useForm<ClientFilterForm>({
    resolver: zodResolver(ClientFilterFormSchema),
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
            name="civility"
            options={civilities}
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
            name="source_id"
            options={sources}
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

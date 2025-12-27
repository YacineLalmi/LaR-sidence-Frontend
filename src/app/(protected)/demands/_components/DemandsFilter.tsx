"use client";
import InputSelectField from "@/components/custom-inputs/input-select";
import { Button } from "@/components/ui/button";
import FilterDrawer from "@/components/ui/filter-drawer";
import { Form } from "@/components/ui/form";
import { customToast } from "@/lib/utils";
import { ListItem } from "@/schemas/Global.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const DemandFilterFormSchema = z.object({
  type_id: z.string().optional(),
  status_id: z.string().optional(),
  priority_id: z.string().optional(),
  source_id: z.string().optional(),
  client_id: z.string().optional(),
  bien_id: z.string().optional(),
  agent_id: z.string().optional(),
  created_between: z.string().optional(),
});

type DemandFilterForm = z.infer<typeof DemandFilterFormSchema>;

interface Props {
  types: ListItem[];
  status: ListItem[];
  priorities: ListItem[];
  sources: ListItem[];
  clients: ListItem[];
  biens: ListItem[];
  agents: ListItem[];
}

export default function DemandsFilter({
  types,
  status,
  priorities,
  sources,
  clients,
  biens,
  agents,
}: Props) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const t = useTranslations();
  const router = useRouter();
  const form = useForm<DemandFilterForm>({
    resolver: zodResolver(DemandFilterFormSchema),
    defaultValues: {},
  });

  async function onSubmit(values: DemandFilterForm) {
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
      title={t("demands.filter.title")}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
    >
      <Form {...form}>
        <form id="demand-filter-form" onSubmit={form.handleSubmit(onSubmit, onInvalid)} className="space-y-2 p-5">
          <InputSelectField
            control={form.control}
            name="status_id"
            options={status}
            label={t("demands.filter.label.status")}
            placeholder={t("demands.filter.placeholder.status")}
          />
          <InputSelectField
            control={form.control}
            name="type_id"
            options={types}
            label={t("demands.filter.label.type")}
            placeholder={t("demands.filter.placeholder.type")}
          />
          <InputSelectField
            control={form.control}
            name="client_id"
            options={clients}
            label={t("demands.filter.label.client")}
            placeholder={t("demands.filter.placeholder.client")}
          />
          <InputSelectField
            control={form.control}
            name="agent_id"
            options={agents}
            label={t("demands.filter.label.agent")}
            placeholder={t("demands.filter.placeholder.agent")}
          />
          <InputSelectField
            control={form.control}
            name="bien_id"
            options={biens}
            label={t("demands.filter.label.bien")}
            placeholder={t("demands.filter.placeholder.bien")}
          />
          <InputSelectField
            control={form.control}
            name="source_id"
            options={sources}
            label={t("demands.filter.label.source")}
            placeholder={t("demands.filter.placeholder.source")}
          />
          <Button type="submit" className="w-full mt-5">
            {t("demands.filter.submit")}
          </Button>
        </form>
      </Form>
    </FilterDrawer>
  );
}


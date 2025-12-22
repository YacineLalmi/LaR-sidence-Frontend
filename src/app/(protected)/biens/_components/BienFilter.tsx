"use client";
import InputSelectField from "@/components/custom-inputs/input-select";
import { Button } from "@/components/ui/button";
import FilterDrawer from "@/components/ui/filter-drawer";
import { Form } from "@/components/ui/form";
import { BienFilterForm, BienFilterFormSchema } from "@/schemas/Bien.schema";
import { ListItem } from "@/schemas/Global.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

export default function BienFilter() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const searchParams = useSearchParams();
  const [wilayas, setWilayas] = useState<ListItem[]>([]);
  const [communes, setCommunes] = useState<ListItem[]>([]);
  const [agents, setAgents] = useState<ListItem[]>([]);
  const [bienTypes, setBienTypes] = useState<ListItem[]>([]);
  const [transactionTypes, setTransactionTypes] = useState<ListItem[]>([]);
  const [status, setStatus] = useState<ListItem[]>([]);

  const router = useRouter();
  const form = useForm<BienFilterForm>({
    resolver: zodResolver(BienFilterFormSchema),
    defaultValues: {},
  });

  const selectedWilayaId = form.watch("wilaya_id");

  const loadOptions = useCallback(async (optionsEndPoint: string): Promise<ListItem[]> => {
    try {
      return await fetch(optionsEndPoint, { cache: "force-cache", next: { revalidate: 300 } }).then((res) =>
        res.json()
      );
    } catch (error) {
      console.error("erroorrrrr", error);
    }
    return [];
  }, []);
  async function onSubmit(values: BienFilterForm) {
    const params = new URLSearchParams();

    Object.entries(values).forEach(([key, value]) => {
      if (value) {
        params.append(key, value.toString());
      }
    });

    router.push(`?${params.toString()}`);
    setIsOpen(false);
  }
  const t = useTranslations();

  useEffect(() => {
    loadOptions("/api/lists/wilayas").then((data) => {
      setWilayas(data);
      form.setValue("wilaya_id", searchParams.get("wilaya_id") || undefined);
    });
    loadOptions("/api/lists/agents").then((data) => {
      setAgents(data);
      form.setValue("agent_id", searchParams.get("agent_id") || undefined);
    });
    loadOptions("/api/lists/biens/types").then((data) => {
      setBienTypes(data);
      form.setValue("bien_type_id", searchParams.get("bien_type_id") || undefined);
    });
    loadOptions("/api/lists/transactions/types").then((data) => {
      setTransactionTypes(data);
      form.setValue("transaction_type_id", searchParams.get("transaction_type_id") || undefined);
    });
    loadOptions("/api/lists/biens/status").then((data) => {
      setStatus(data);
      form.setValue("status_id", searchParams.get("status_id") || undefined);
    });

    return () => {
      setWilayas([]);
      setCommunes([]);
      setAgents([]);
      setBienTypes([]);
      setTransactionTypes([]);
      setStatus([]);
      form.reset();
    };
  }, [form]);

  useEffect(() => {
    setCommunes([]);
    form.resetField("commune_id");
    loadOptions(`/api/lists/wilayas/${selectedWilayaId}/communes`).then((data) => {
      setCommunes(data);
      form.setValue("commune_id", searchParams.get("commune_id") || undefined);
    });

    return () => {
      console.log("resetting communes");
      setCommunes([]);
      form.resetField("commune_id");
    };
  }, [selectedWilayaId]);
  return (
    <FilterDrawer buttonText={t("common.filter")} title={t("biens.filter.title")} isOpen={isOpen} setIsOpen={setIsOpen}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2 p-5">
          <InputSelectField
            control={form.control}
            name="bien_type_id"
            label={t("biens.filter.label.bienType")}
            options={bienTypes}
            placeholder={t("biens.filter.placeholder.bienType")}
          />
          <InputSelectField
            control={form.control}
            name="status_id"
            label={t("biens.filter.label.status")}
            options={status}
            placeholder={t("biens.filter.placeholder.status")}
          />
          <InputSelectField
            control={form.control}
            name="transaction_type_id"
            label={t("biens.filter.label.transactionType")}
            options={transactionTypes}
            placeholder={t("biens.filter.placeholder.transactionType")}
          />
          <InputSelectField
            control={form.control}
            name="wilaya_id"
            label={t("biens.filter.label.wilaya")}
            options={wilayas}
            placeholder={t("biens.filter.placeholder.wilaya")}
          />
          <InputSelectField
            control={form.control}
            name="commune_id"
            label={t("biens.filter.label.commune")}
            options={communes}
            placeholder={t("biens.filter.placeholder.commune")}
            revalidate={0}
          />
          <InputSelectField
            control={form.control}
            name="agent_id"
            label={t("biens.filter.label.agent")}
            options={agents}
            placeholder={t("biens.filter.placeholder.agent")}
          />
          <Button type="submit" >
            {t("biens.filter.submit")}
          </Button>
        </form>
      </Form>
    </FilterDrawer>
  );
}

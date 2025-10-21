"use client";
import InputSelectField from "@/components/custom-inputs/input-select";
import InputTextField from "@/components/custom-inputs/input-text";
import { ListItem } from "@/schemas/Global.schema";
import { useTranslations } from "next-intl";
import React from "react";
import { UseFormReturn } from "react-hook-form";
import Section from "./section";
import InputNumberField from "@/components/custom-inputs/input-number";
import { BienForm } from "@/schemas/biens/bien-form.schema";

interface Props {
  form: UseFormReturn<BienForm>;
  isPending?: boolean;
  bienTypes: ListItem[];
  transactionsTypes: ListItem[];
  status: ListItem[];
  agents: ListItem[];
}

export default function GeneralInformation({
  form,
  isPending = false,
  bienTypes,
  transactionsTypes,
  status,
  agents,
}: Props) {
  const t = useTranslations();
  return (
    <Section header={t("biens.create.form.generalInformation.header")}>
      <InputTextField
        control={form.control}
        name="title"
        label={t("biens.create.form.generalInformation.title.label")}
        disabled={isPending}
        required
        placeholder={t("biens.create.form.generalInformation.title.placeholder")}
      />

      <InputSelectField
        control={form.control}
        name="bien_type_id"
        label={t("biens.create.form.generalInformation.type.label")}
        options={bienTypes}
        placeholder={t("biens.create.form.generalInformation.type.placeholder")}
        disabled={isPending}
        required
      />

      <InputSelectField
        control={form.control}
        name="transaction_type_id"
        label={t("biens.create.form.generalInformation.transactionType.label")}
        options={transactionsTypes}
        placeholder={t("biens.create.form.generalInformation.transactionType.placeholder")}
        disabled={isPending}
        required
      />

      <InputSelectField
        control={form.control}
        name="status_id"
        label={t("biens.create.form.generalInformation.status.label")}
        options={status}
        placeholder={t("biens.create.form.generalInformation.status.placeholder")}
        disabled={isPending}
        required
      />

      <InputSelectField
        control={form.control}
        name="agent_id"
        label={t("biens.create.form.generalInformation.agent.label")}
        options={agents}
        placeholder={t("biens.create.form.generalInformation.agent.placeholder")}
        disabled={isPending}
        required
      />

      <InputNumberField
        control={form.control}
        name="price"
        label={t("biens.create.form.generalInformation.price.label")}
        disabled={isPending}
        required
        placeholder={t("biens.create.form.generalInformation.price.placeholder")}
      />

      <InputNumberField
        control={form.control}
        name="monthly_charges"
        label={t("biens.create.form.generalInformation.monthlyCharges.label")}
        disabled={isPending}
        required
        placeholder={t("biens.create.form.generalInformation.monthlyCharges.placeholder")}
      />
    </Section>
  );
}

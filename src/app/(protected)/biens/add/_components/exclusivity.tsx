"use client";
import { InputDateField } from "@/components/custom-inputs/input-date";
import { useTranslations } from "next-intl";
import React from "react";
import { UseFormReturn } from "react-hook-form";
import Section from "./section";
import { ListItem } from "@/schemas/Global.schema";
import InputSelectField from "@/components/custom-inputs/input-select";
import { BienForm } from "@/schemas/biens/bien-form.schema";

interface Props {
  form: UseFormReturn<BienForm>;
  isPending?: boolean;
  priorities: ListItem[];
}
export default function Exclusivity({ form, isPending = false, priorities }: Props) {
  const t = useTranslations();
  return (
    <Section header={t("biens.create.form.exclusivity.header")}>
      <div className="grid grid-cols-2 gap-5">
        <InputDateField
          control={form.control}
          name="exclusivity_start"
          label={t("biens.create.form.exclusivity.exclusiveStartDate.label")}
          placeholder={t("biens.create.form.exclusivity.exclusiveStartDate.placeholder")}
          disabled={isPending}
        />
        <InputDateField
          control={form.control}
          name="exclusivity_end"
          label={t("biens.create.form.exclusivity.exclusiveEndDate.label")}
          placeholder={t("biens.create.form.exclusivity.exclusiveEndDate.placeholder")}
          disabled={isPending}
        />
      </div>
      <InputSelectField
        control={form.control}
        name="commune_id"
        label={t("biens.create.form.exclusivity.priority.label")}
        placeholder={t("biens.create.form.exclusivity.priority.placeholder")}
        disabled={isPending}
        options={priorities}
      />
    </Section>
  );
}

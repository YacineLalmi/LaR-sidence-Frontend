"use client";
import { InputDateField } from "@/components/custom-inputs/input-date";
import { useTranslations } from "next-intl";
import React from "react";
import { UseFormReturn } from "react-hook-form";
import Section from "./section";
import { ListItem } from "@/schemas/Global.schema";
import InputSelectField from "@/components/custom-inputs/input-select";
import { BienForm } from "@/schemas/biens/bien-form.schema";
import { TRANSLATIONS_KEYS } from "@/i18n/translation-constants";

interface Props {
  form: UseFormReturn<BienForm>;
  isPending?: boolean;
  priorities: ListItem[];
}
export default function Exclusivity({ form, isPending = false, priorities }: Props) {
  const t = useTranslations();
  return (
    <Section header={t(TRANSLATIONS_KEYS.BIENS.FORM.EXCLUSIVITY)}>
      <div className="grid grid-cols-2 gap-5">
        <InputDateField
          control={form.control}
          name="exclusivity_start"
          label={t(TRANSLATIONS_KEYS.BIENS.FORM.INPUTS.LABELS.EXCLUSIVE_START_DATE)}
          placeholder={t(TRANSLATIONS_KEYS.BIENS.FORM.INPUTS.PLACEHOLDERS.EXCLUSIVE_START_DATE)}
          disabled={isPending}
        />
        <InputDateField
          control={form.control}
          name="exclusivity_end"
          label={t(TRANSLATIONS_KEYS.BIENS.FORM.INPUTS.LABELS.EXCLUSIVE_END_DATE)}
          placeholder={t(TRANSLATIONS_KEYS.BIENS.FORM.INPUTS.PLACEHOLDERS.EXCLUSIVE_END_DATE)}
          disabled={isPending}
        />
      </div>
      <InputSelectField
        control={form.control}
        name="priority_id"
        label={t(TRANSLATIONS_KEYS.BIENS.FORM.INPUTS.LABELS.PRIORITY)}
        placeholder={t(TRANSLATIONS_KEYS.BIENS.FORM.INPUTS.PLACEHOLDERS.PRIORITY)}
        disabled={isPending}
        options={priorities}
      />
    </Section>
  );
}

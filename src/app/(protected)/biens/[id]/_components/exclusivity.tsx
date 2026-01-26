"use client";
import { InputDateField } from "@/components/custom-inputs/input-date";
import { useTranslations } from "next-intl";
import React from "react";
import { UseFormReturn } from "react-hook-form";
import Section from "./section";
import { ListItem } from "@/schemas/global.schema";
import InputSelectField from "@/components/custom-inputs/input-select";
import { BienForm } from "@/schemas/biens/bien-form.schema";
import { TRANSLATIONS_KEYS } from "@/i18n/translation-constants";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface Props {
  form: UseFormReturn<BienForm>;
  isPending?: boolean;
  priorities: ListItem[];
}

export default function Exclusivity({ form, isPending = false, priorities }: Props) {
  const t = useTranslations();
  const isExclusive = form.watch("exclusivity");

  
  // Clear dates when exclusivity is turned off
  const handleExclusivityToggle = (checked: boolean) => {
    form.setValue("exclusivity", checked, { shouldDirty: true, shouldTouch: true, shouldValidate: true });
    if (!checked) {
      form.setValue("exclusivity_start", undefined, { shouldDirty: true, shouldValidate: true });
      form.setValue("exclusivity_end", undefined, { shouldDirty: true, shouldValidate: true });
    }
  };

  return (
    <Section header={t(TRANSLATIONS_KEYS.BIENS.FORM.EXCLUSIVITY)}>
      {/* Exclusivity Toggle */}
      <div className="flex items-center space-x-2 mb-5">
        <Switch
          id="exclusivity-toggle"
          checked={isExclusive}
          onCheckedChange={handleExclusivityToggle}
          disabled={isPending}
        />
        <Label htmlFor="exclusivity-toggle" className="text-sm font-medium cursor-pointer">
          {t(TRANSLATIONS_KEYS.BIENS.FORM.EXCLUSIVITY)}
        </Label>
      </div>

      {/* Date Fields - Only shown when exclusivity is enabled */}
      {isExclusive && (
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
      )}

      {/* Priority Field - Always visible */}
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

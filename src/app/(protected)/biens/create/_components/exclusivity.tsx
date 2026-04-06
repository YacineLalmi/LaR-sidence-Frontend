"use client";

import { InputDateField } from "@/components/custom-inputs/input-date";
import { useTranslations } from "next-intl";
import { Control, UseFormReturn } from "react-hook-form";
import Section from "./section";
import { ListItem } from "@/schemas/global.schema";
import InputSelectField from "@/components/custom-inputs/input-select";
import { BienFormInput, BienFormOutput } from "@/schemas/biens/bien-form.schema";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { TRANSLATIONS_KEYS_2 } from "@/i18n/translation-keys";

interface Props {
  form: UseFormReturn<BienFormInput, any, BienFormOutput>;
  isPending?: boolean;
  priorities: ListItem[];
}

export default function Exclusivity({ form, isPending = false, priorities }: Props) {
  const translation = useTranslations();
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
    <Section header={translation(TRANSLATIONS_KEYS_2.BIENS.FORM.TITLES.SECTIONS.EXCLUSIVITY)}>
      {/* Exclusivity Toggle */}
      <div className="flex items-center space-x-2 mb-5">
        <Switch
          id="exclusivity-toggle"
          checked={isExclusive}
          onCheckedChange={handleExclusivityToggle}
          disabled={isPending}
        />
        <Label htmlFor="exclusivity-toggle" className="text-sm font-medium cursor-pointer">
          {translation(TRANSLATIONS_KEYS_2.BIENS.FORM.LABELS.IS_EXCLUSIVE)}
        </Label>
      </div>

      {/* Date Fields - Only shown when exclusivity is enabled */}
      {isExclusive && (
        <div className="grid grid-cols-2 gap-5">
          <InputDateField
            control={form.control as Control<BienFormInput, any, any>}
            name="exclusivity_start"
            label={translation(TRANSLATIONS_KEYS_2.BIENS.FORM.LABELS.EXCLUSIVE_START_DATE)}
            placeholder={translation(TRANSLATIONS_KEYS_2.BIENS.FORM.PLACEHOLDERS.EXCLUSIVE_START_DATE)}
            disabled={isPending}
          />
          <InputDateField
            control={form.control as Control<BienFormInput, any, any>}
            name="exclusivity_end"
            label={translation(TRANSLATIONS_KEYS_2.BIENS.FORM.LABELS.EXCLUSIVE_END_DATE)}
            placeholder={translation(TRANSLATIONS_KEYS_2.BIENS.FORM.PLACEHOLDERS.EXCLUSIVE_END_DATE)}
            disabled={isPending}
          />
        </div>
      )}

      {/* Priority Field - Always visible */}
      <InputSelectField
        control={form.control as Control<BienFormInput, any, any>}
        name="priority_id"
        label={translation(TRANSLATIONS_KEYS_2.BIENS.FORM.LABELS.PRIORITY)}
        placeholder={translation(TRANSLATIONS_KEYS_2.BIENS.FORM.PLACEHOLDERS.PRIORITY)}
        disabled={isPending}
        options={priorities}
      />
    </Section>
  );
}

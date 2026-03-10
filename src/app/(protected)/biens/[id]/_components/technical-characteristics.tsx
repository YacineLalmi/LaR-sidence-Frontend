import { InputDateField } from "@/components/custom-inputs/input-date";
import InputNumberField from "@/components/custom-inputs/input-number";
import { useTranslations } from "next-intl";
import React from "react";
import { UseFormReturn } from "react-hook-form";
import Section from "./section";
import { BienForm } from "@/schemas/biens/bien-form.schema";
import { TRANSLATIONS_KEYS } from "@/i18n/translation-constants";

interface Props {
  form: UseFormReturn<BienForm>;
  isPending?: boolean;
}

export default function TechnicalCharacteristics({ form, isPending = false }: Props) {
  const translation = useTranslations();
  return (
    <Section header={translation(TRANSLATIONS_KEYS.BIENS.FORM.TECHNICAL_CHARACTERISTICS)}>
      <InputNumberField
        control={form.control}
        name="total_surface"
        label={translation(TRANSLATIONS_KEYS.BIENS.FORM.INPUTS.LABELS.TOTAL_SURFACE)}
        disabled={isPending}
        required
        placeholder={translation(TRANSLATIONS_KEYS.BIENS.FORM.INPUTS.PLACEHOLDERS.TOTAL_SURFACE)}
      />
      <InputNumberField
        control={form.control}
        name="habitable_surface"
        label={translation(TRANSLATIONS_KEYS.BIENS.FORM.INPUTS.LABELS.HABITAL_SURFACE)}
        disabled={isPending}
        required
        placeholder={translation(TRANSLATIONS_KEYS.BIENS.FORM.INPUTS.PLACEHOLDERS.HABITAL_SURFACE)}
      />
      <InputNumberField
        control={form.control}
        name="developed_surface"
        label={translation(TRANSLATIONS_KEYS.BIENS.FORM.INPUTS.LABELS.DEVELOPED_SURFACE)}
        disabled={isPending}
        placeholder={translation(TRANSLATIONS_KEYS.BIENS.FORM.INPUTS.PLACEHOLDERS.DEVELOPED_SURFACE)}
      />
      <InputNumberField
        control={form.control}
        name="floor_number"
        label={translation(TRANSLATIONS_KEYS.BIENS.FORM.INPUTS.LABELS.FLOOR_NUMBER)}
        disabled={isPending}
        required
        placeholder={translation(TRANSLATIONS_KEYS.BIENS.FORM.INPUTS.PLACEHOLDERS.FLOOR_NUMBER)}
      />
      <div className="grid grid-cols-2 gap-5">
        <InputNumberField
          control={form.control}
          name="rooms_number"
          label={translation(TRANSLATIONS_KEYS.BIENS.FORM.INPUTS.LABELS.ROOMS)}
          disabled={isPending}
          required
          placeholder={translation(TRANSLATIONS_KEYS.BIENS.FORM.INPUTS.PLACEHOLDERS.ROOMS)}
        />
        <InputNumberField
          control={form.control}
          name="bathrooms_number"
          label={translation(TRANSLATIONS_KEYS.BIENS.FORM.INPUTS.LABELS.BATHROOMS)}
          disabled={isPending}
          required
          placeholder={translation(TRANSLATIONS_KEYS.BIENS.FORM.INPUTS.PLACEHOLDERS.BATHROOMS)}
        />
        <InputNumberField
          control={form.control}
          name="bedrooms_number"
          label={translation(TRANSLATIONS_KEYS.BIENS.FORM.INPUTS.LABELS.BEDROOMS)}
          disabled={isPending}
          required
          placeholder={translation(TRANSLATIONS_KEYS.BIENS.FORM.INPUTS.PLACEHOLDERS.BEDROOMS)}
        />
        <InputDateField
          control={form.control}
          name="availability_date"
          label={translation(TRANSLATIONS_KEYS.BIENS.FORM.INPUTS.LABELS.AVAILABILITY_DATE)}
          disabled={isPending}
          required
          placeholder={translation(TRANSLATIONS_KEYS.BIENS.FORM.INPUTS.PLACEHOLDERS.AVAILABILITY_DATE)}
        />
      </div>
    </Section>
  );
}

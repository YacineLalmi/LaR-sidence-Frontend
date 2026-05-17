import { InputDateField } from "@/components/custom-inputs/input-date";
import InputNumberField from "@/components/custom-inputs/input-number";
import { useTranslations } from "next-intl";
import { Control, UseFormReturn } from "react-hook-form";
import Section from "./section";
import { BienFormInput, BienFormOutput } from "@/schemas/biens/bien-form.schema";
import { TRANSLATIONS_KEYS_2 } from "@/i18n/translation-keys";

interface Props {
  form: UseFormReturn<BienFormInput, any, BienFormOutput>;
  isPending?: boolean;
}

export default function TechnicalCharacteristics({ form, isPending = false }: Props) {
  const translation = useTranslations();
  return (
    <Section header={translation(TRANSLATIONS_KEYS_2.BIENS.FORM.TITLES.SECTIONS.TECHNICAL_CHARACTERISTICS)}>
      <InputNumberField
        control={form.control as Control<BienFormInput, any, any>}
        name="total_surface"
        label={translation(TRANSLATIONS_KEYS_2.BIENS.FORM.LABELS.TOTAL_SURFACE)}
        disabled={isPending}
        required
        placeholder={translation(TRANSLATIONS_KEYS_2.BIENS.FORM.PLACEHOLDERS.TOTAL_SURFACE)}
      />
      <InputNumberField
        control={form.control as Control<BienFormInput, any, any>}
        name="habitable_surface"
        label={translation(TRANSLATIONS_KEYS_2.BIENS.FORM.LABELS.HABITABLE_SURFACE)}
        disabled={isPending}
        placeholder={translation(TRANSLATIONS_KEYS_2.BIENS.FORM.PLACEHOLDERS.HABITABLE_SURFACE)}
      />
      <InputNumberField
        control={form.control as Control<BienFormInput, any, any>}
        name="developed_surface"
        label={translation(TRANSLATIONS_KEYS_2.BIENS.FORM.LABELS.DEVELOPED_SURFACE)}
        disabled={isPending}
        placeholder={translation(TRANSLATIONS_KEYS_2.BIENS.FORM.PLACEHOLDERS.DEVELOPED_SURFACE)}
      />
      <InputNumberField
        control={form.control as Control<BienFormInput, any, any>}
        name="floor_number"
        label={translation(TRANSLATIONS_KEYS_2.BIENS.FORM.LABELS.FLOOR_NUMBER)}
        disabled={isPending}
        placeholder={translation(TRANSLATIONS_KEYS_2.BIENS.FORM.PLACEHOLDERS.FLOOR_NUMBER)}
      />
      <div className="grid grid-cols-2 gap-5">
        <InputNumberField
          control={form.control as Control<BienFormInput, any, any>}
          name="rooms_number"
          label={translation(TRANSLATIONS_KEYS_2.BIENS.FORM.LABELS.ROOMS)}
          disabled={isPending}
          placeholder={translation(TRANSLATIONS_KEYS_2.BIENS.FORM.PLACEHOLDERS.ROOMS)}
        />
        <InputNumberField
          control={form.control as Control<BienFormInput, any, any>}
          name="bathrooms_number"
          label={translation(TRANSLATIONS_KEYS_2.BIENS.FORM.LABELS.BATHROOMS)}
          disabled={isPending}
          placeholder={translation(TRANSLATIONS_KEYS_2.BIENS.FORM.PLACEHOLDERS.BATHROOMS)}
        />
        <InputNumberField
          control={form.control as Control<BienFormInput, any, any>}
          name="bedrooms_number"
          label={translation(TRANSLATIONS_KEYS_2.BIENS.FORM.LABELS.BEDROOMS)}
          disabled={isPending}
          placeholder={translation(TRANSLATIONS_KEYS_2.BIENS.FORM.PLACEHOLDERS.BEDROOMS)}
        />
        <InputDateField
          control={form.control as Control<BienFormInput, any, any>}
          name="availability_date"
          label={translation(TRANSLATIONS_KEYS_2.BIENS.FORM.LABELS.AVAILABILITY_DATE)}
          disabled={isPending}
          required
          placeholder={translation(TRANSLATIONS_KEYS_2.BIENS.FORM.PLACEHOLDERS.AVAILABILITY_DATE)}
        />
      </div>
    </Section>
  );
}

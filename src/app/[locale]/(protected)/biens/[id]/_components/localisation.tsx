import InputSelectField from "@/components/custom-inputs/input-select";
import InputTextField from "@/components/custom-inputs/input-text";
import { ListItem } from "@/schemas/global.schema";
import { useTranslations } from "next-intl";
import React, { useState } from "react";
import { Control, UseFormReturn } from "react-hook-form";
import Section from "./section";
import { BienFormInput, BienFormOutput } from "@/schemas/biens/bien-form.schema";
import { getCommuneByWilaya } from "@/actions/commune/get-commune-by-wilaya";
import { TRANSLATIONS_KEYS_2 } from "@/i18n/translation-keys";

interface Props {
  form: UseFormReturn<BienFormInput, any, BienFormOutput>;
  isPending?: boolean;
  wilayas: ListItem[];
}

export default function Localisation({ form, isPending = false, wilayas }: Props) {
  const translation = useTranslations();
  const selectedWilayaId = form.watch("wilaya_id");
  const [communes, setCommunes] = useState<ListItem[]>([]);

  React.useEffect(() => {
    if (!!selectedWilayaId) {
      getCommuneByWilaya(selectedWilayaId)
        .then((res) => setCommunes(res))
        .catch((err) => setCommunes([]));
    }
  }, [selectedWilayaId, form]);
  return (
    <Section header={translation(TRANSLATIONS_KEYS_2.BIENS.FORM.TITLES.SECTIONS.LOCALISATION)}>
      <div className="flex gap-5">
        <InputSelectField
          control={form.control as Control<BienFormInput, any, any>}
          name="wilaya_id"
          label={translation(TRANSLATIONS_KEYS_2.BIENS.FORM.LABELS.WILAYA)}
          options={wilayas}
          placeholder={translation(TRANSLATIONS_KEYS_2.BIENS.FORM.PLACEHOLDERS.WILAYA)}
          disabled={isPending}
          required
        />
        <InputSelectField
          control={form.control as Control<BienFormInput, any, any>}
          name="commune_id"
          label={translation(TRANSLATIONS_KEYS_2.BIENS.FORM.LABELS.COMMUNE)}
          options={communes}
          placeholder={translation(TRANSLATIONS_KEYS_2.BIENS.FORM.PLACEHOLDERS.COMMUNE)}
          disabled={isPending}
          required
        />
      </div>

      <InputTextField
        control={form.control as Control<BienFormInput, any, any>}
        name="adresse"
        label={translation(TRANSLATIONS_KEYS_2.BIENS.FORM.LABELS.ADDRESS)}
        disabled={isPending}
        placeholder={translation(TRANSLATIONS_KEYS_2.BIENS.FORM.PLACEHOLDERS.ADDRESS)}
        required
      />

      <InputTextField
        control={form.control as Control<BienFormInput, any, any>}
        name="postal_code"
        label={translation(TRANSLATIONS_KEYS_2.BIENS.FORM.LABELS.POSTAL_CODE)}
        disabled={isPending}
        placeholder={translation(TRANSLATIONS_KEYS_2.BIENS.FORM.PLACEHOLDERS.POSTAL_CODE)}
      />

      <InputTextField
        control={form.control as Control<BienFormInput, any, any>}
        name="coordinates"
        label={translation(TRANSLATIONS_KEYS_2.BIENS.FORM.LABELS.GPS_COORDINATES)}
        disabled={isPending}
        placeholder={translation(TRANSLATIONS_KEYS_2.BIENS.FORM.PLACEHOLDERS.GPS_COORDINATES)}
        required
      />
    </Section>
  );
}

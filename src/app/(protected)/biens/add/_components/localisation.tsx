import InputSelectField from "@/components/custom-inputs/input-select";
import InputTextField from "@/components/custom-inputs/input-text";
import { ListItem } from "@/schemas/global.schema";
import { useTranslations } from "next-intl";
import React, { useState } from "react";
import { Control, UseFormReturn } from "react-hook-form";
import Section from "./section";
import { BienFormInput, BienFormOutput } from "@/schemas/biens/bien-form.schema";
import { TRANSLATIONS_KEYS } from "@/i18n/translation-constants";
import { CommuneService } from "@/services/commune.service";
import { getCommuneByWilaya } from "@/actions/commune/get-commune-by-wilaya";

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
    <Section header={translation(TRANSLATIONS_KEYS.BIENS.FORM.LOCALISATION)}>
      <div className="flex gap-5">
        <InputSelectField
          control={form.control as Control<BienFormInput, any, any>}
          name="wilaya_id"
          label={translation(TRANSLATIONS_KEYS.BIENS.FORM.INPUTS.LABELS.WILAYA)}
          options={wilayas}
          placeholder={translation(TRANSLATIONS_KEYS.BIENS.FORM.INPUTS.PLACEHOLDERS.WILAYA)}
          disabled={isPending}
          required
        />
        <InputSelectField
          control={form.control as Control<BienFormInput, any, any>}
          name="commune_id"
          label={translation(TRANSLATIONS_KEYS.BIENS.FORM.INPUTS.LABELS.COMMUNE)}
          options={communes}
          placeholder={translation(TRANSLATIONS_KEYS.BIENS.FORM.INPUTS.PLACEHOLDERS.COMMUNE)}
          disabled={isPending}
          required
        />
      </div>

      <InputTextField
        control={form.control as Control<BienFormInput, any, any>}
        name="adresse"
        label={translation(TRANSLATIONS_KEYS.BIENS.FORM.INPUTS.LABELS.ADDRESS)}
        disabled={isPending}
        placeholder={translation(TRANSLATIONS_KEYS.BIENS.FORM.INPUTS.PLACEHOLDERS.ADDRESS)}
        required
      />

      <InputTextField
        control={form.control as Control<BienFormInput, any, any>}
        name="postal_code"
        label={translation(TRANSLATIONS_KEYS.BIENS.FORM.INPUTS.LABELS.POSTAL_CODE)}
        disabled={isPending}
        placeholder={translation(TRANSLATIONS_KEYS.BIENS.FORM.INPUTS.PLACEHOLDERS.POSTAL_CODE)}
      />

      <InputTextField
        control={form.control as Control<BienFormInput, any, any>}
        name="coordinates"
        label={translation(TRANSLATIONS_KEYS.BIENS.FORM.INPUTS.LABELS.GPS_COORDINATES)}
        disabled={isPending}
        placeholder={translation(TRANSLATIONS_KEYS.BIENS.FORM.INPUTS.PLACEHOLDERS.GPS_COORDINATES)}
        required
      />
    </Section>
  );
}

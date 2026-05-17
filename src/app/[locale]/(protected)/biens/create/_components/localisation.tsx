import InputSelectField from "@/components/custom-inputs/input-select";
import InputTextField from "@/components/custom-inputs/input-text";
import { ListItem } from "@/schemas/global.schema";
import { useTranslations } from "next-intl";
import { useEffect, useState, useTransition } from "react";
import { Control, UseFormReturn } from "react-hook-form";
import Section from "./section";
import { BienFormInput, BienFormOutput } from "@/schemas/biens/bien-form.schema";
import { getCommuneByWilaya } from "@/actions/commune/get-commune-by-wilaya";
import { TRANSLATIONS_KEYS_2 } from "@/i18n/translation-keys";
import { getWilayaListAction } from "@/actions/wilayas/get-wilaya-list.action";

interface Props {
  form: UseFormReturn<BienFormInput, any, BienFormOutput>;
  isPending?: boolean;
}

export default function Localisation({ form, isPending = false }: Props) {
  const translation = useTranslations();
  const selectedWilayaId = form.watch("wilaya_id");
  const [wilayas, setWilayas] = useState<ListItem[]>([]);
  const [communes, setCommunes] = useState<ListItem[]>([]);

  const [isWilayasPending, startWilayasTransition] = useTransition();
  const [isCommunesPending, startCommunesTransition] = useTransition();

  useEffect(() => {
    startWilayasTransition(async () => {
      try {
        const results = await getWilayaListAction();
        setWilayas(results);
      } catch (error) {
        console.error("Failed to fetch options:", error);
        setWilayas([]);
      }
    });
  }, []);

  useEffect(() => {
    if (selectedWilayaId) {
      startCommunesTransition(async () => {
        try {
          const results = await getCommuneByWilaya(selectedWilayaId);
          setCommunes(results);
        } catch (error) {
          console.error("Failed to fetch options:", error);
          setCommunes([]);
        }
      });
    }
  }, [selectedWilayaId]);

  return (
    <Section header={translation(TRANSLATIONS_KEYS_2.BIENS.FORM.TITLES.SECTIONS.LOCALISATION)}>
      <div className="flex gap-5">
        <InputSelectField
          control={form.control as Control<BienFormInput, any, any>}
          name="wilaya_id"
          label={translation(TRANSLATIONS_KEYS_2.BIENS.FORM.LABELS.WILAYA)}
          placeholder={translation(TRANSLATIONS_KEYS_2.BIENS.FORM.PLACEHOLDERS.WILAYA)}
          options={wilayas}
          isPending={isWilayasPending}
          disabled={isPending}
          required
        />
        <InputSelectField
          control={form.control as Control<BienFormInput, any, any>}
          name="commune_id"
          label={translation(TRANSLATIONS_KEYS_2.BIENS.FORM.LABELS.COMMUNE)}
          placeholder={translation(TRANSLATIONS_KEYS_2.BIENS.FORM.PLACEHOLDERS.COMMUNE)}
          options={communes}
          isPending={isCommunesPending}
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
      />
    </Section>
  );
}

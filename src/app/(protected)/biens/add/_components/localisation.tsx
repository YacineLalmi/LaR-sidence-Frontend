import InputSelectField from "@/components/custom-inputs/input-select";
import InputTextField from "@/components/custom-inputs/input-text";
import { ListItem } from "@/schemas/Global.schema";
import { useTranslations } from "next-intl";
import React, { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { loadOptions } from "@/lib/utils";
import Section from "./section";
import { BienForm } from "@/schemas/biens/bien-form.schema";

interface Props {
  form: UseFormReturn<BienForm>;
  isPending?: boolean;
  wilayas: ListItem[];
}

export default function Localisation({ form, isPending = false, wilayas }: Props) {
  const t = useTranslations();
  const selectedWilayaId = form.watch("wilaya_id");
  const [communes, setCommunes] = useState<ListItem[]>([]);

  React.useEffect(() => {
    console.log(selectedWilayaId)
    if (!!selectedWilayaId) {
      loadOptions(`/api/lists/wilayas/${selectedWilayaId}/communes`).then((data) => {
        setCommunes(data);
        form.resetField("commune_id");
      });
    }
  }, [selectedWilayaId, form]);
  return (
    <Section header={t("biens.create.form.technicalCharacteristics.header")}>
      <div className="flex gap-5">
        <InputSelectField
          control={form.control}
          name="wilaya_id"
          label={t("biens.create.form.localisation.wilaya.label")}
          options={wilayas}
          placeholder={t("biens.create.form.localisation.wilaya.placeholder")}
          disabled={isPending}
          required
        />
        <InputSelectField
          control={form.control}
          name="commune_id"
          label={t("biens.create.form.localisation.commune.label")}
          options={communes}
          placeholder={t("biens.create.form.localisation.commune.placeholder")}
          disabled={isPending}
          required
        />
      </div>

      <InputTextField
        control={form.control}
        name="adresse"
        label={t("biens.create.form.localisation.address.label")}
        disabled={isPending}
        required
        placeholder={t("biens.create.form.localisation.address.placeholder")}
      />

      <InputTextField
        control={form.control}
        name="postal_code"
        label={t("biens.create.form.localisation.postalCode.label")}
        disabled={isPending}
        required
        placeholder={t("biens.create.form.localisation.postalCode.placeholder")}
      />

      <InputTextField
        control={form.control}
        name="coordinates"
        label={t("biens.create.form.localisation.GPSCordinates.label")}
        disabled={isPending}
        required
        placeholder={t("biens.create.form.localisation.GPSCordinates.placeholder")}
      />
    </Section>
  );
}

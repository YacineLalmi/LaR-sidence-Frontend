import { InputDateField } from "@/components/custom-inputs/input-date";
import InputNumberField from "@/components/custom-inputs/input-number";
import { useTranslations } from "next-intl";
import React from "react";
import { UseFormReturn } from "react-hook-form";
import Section from "./section";
import { BienForm } from "@/schemas/biens/bien-form.schema";

interface Props {
  form: UseFormReturn<BienForm>;
  isPending?: boolean;
}

export default function TechnicalCharacteristics({ form, isPending = false }: Props) {
  const t = useTranslations();
  return (
    <Section header={t("biens.create.form.technicalCharacteristics.header")}>
      <InputNumberField
        control={form.control}
        name="habitable_surface"
        label={t("biens.create.form.technicalCharacteristics.habitalSurface.label")}
        disabled={isPending}
        required
        placeholder={t("biens.create.form.technicalCharacteristics.habitalSurface.placeholder")}
      />

      <InputNumberField
        control={form.control}
        name="total_surface"
        label={t("biens.create.form.technicalCharacteristics.totalSurface.label")}
        disabled={isPending}
        required
        placeholder={t("biens.create.form.technicalCharacteristics.totalSurface.placeholder")}
      />

      <InputNumberField
        control={form.control}
        name="developed_surface"
        label={t("biens.create.form.technicalCharacteristics.devolopedSurface.label")}
        disabled={isPending}
        required
        placeholder={t("biens.create.form.technicalCharacteristics.devolopedSurface.placeholder")}
      />
      <InputNumberField
        control={form.control}
        name="floor_number"
        label={t("biens.create.form.technicalCharacteristics.floorNumber.label")}
        disabled={isPending}
        required
        placeholder={t("biens.create.form.technicalCharacteristics.floorNumber.placeholder")}
      />
      <div className="grid grid-cols-2 gap-5">
        <InputNumberField
          control={form.control}
          name="rooms_number"
          label={t("biens.create.form.technicalCharacteristics.rooms.label")}
          disabled={isPending}
          required
          placeholder={t("biens.create.form.technicalCharacteristics.rooms.placeholder")}
        />
        <InputNumberField
          control={form.control}
          name="bathrooms_number"
          label={t("biens.create.form.technicalCharacteristics.bathrooms.label")}
          disabled={isPending}
          required
          placeholder={t("biens.create.form.technicalCharacteristics.bathrooms.placeholder")}
        />
        <InputNumberField
          control={form.control}
          name="bedrooms_number"
          label={t("biens.create.form.technicalCharacteristics.bedrooms.label")}
          disabled={isPending}
          required
          placeholder={t("biens.create.form.technicalCharacteristics.bedrooms.placeholder")}
        />
        <InputDateField
          control={form.control}
          name="availability_date"
          label={t("biens.create.form.technicalCharacteristics.availabilityDate.label")}
          disabled={isPending}
          required
          placeholder={t("biens.create.form.technicalCharacteristics.availabilityDate.placeholder")}
        />
      </div>
    </Section>
  );
}

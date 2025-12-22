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
  const t = useTranslations("biens.create.form.technicalCharacteristics");
  return (
    <Section header={t("header")}>
      <InputNumberField
        control={form.control}
        name="total_surface"
        label={t("totalSurface.label")}
        disabled={isPending}
        required
        placeholder={t("totalSurface.placeholder")}
      />
      <InputNumberField
        control={form.control}
        name="habitable_surface"
        label={t("habitalSurface.label")}
        disabled={isPending}
        required
        placeholder={t("habitalSurface.placeholder")}
      />
      <InputNumberField
        control={form.control}
        name="developed_surface"
        label={t("devolopedSurface.label")}
        disabled={isPending}
        required
        placeholder={t("devolopedSurface.placeholder")}
      />
      <InputNumberField
        control={form.control}
        name="floor_number"
        label={t("floorNumber.label")}
        disabled={isPending}
        required
        placeholder={t("floorNumber.placeholder")}
      />
      <div className="grid grid-cols-2 gap-5">
        <InputNumberField
          control={form.control}
          name="rooms_number"
          label={t("rooms.label")}
          disabled={isPending}
          required
          placeholder={t("rooms.placeholder")}
        />
        <InputNumberField
          control={form.control}
          name="bathrooms_number"
          label={t("bathrooms.label")}
          disabled={isPending}
          required
          placeholder={t("bathrooms.placeholder")}
        />
        <InputNumberField
          control={form.control}
          name="bedrooms_number"
          label={t("bedrooms.label")}
          disabled={isPending}
          required
          placeholder={t("bedrooms.placeholder")}
        />
        <InputDateField
          control={form.control}
          name="availability_date"
          label={t("availabilityDate.label")}
          disabled={isPending}
          required
          placeholder={t("availabilityDate.placeholder")}
        />
      </div>
    </Section>
  );
}

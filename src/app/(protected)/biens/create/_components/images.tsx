import React from "react";
import { Control, UseFormReturn } from "react-hook-form";
import Section from "./section";
import { useTranslations } from "next-intl";
import { BienFormInput, BienFormOutput } from "@/schemas/biens/bien-form.schema";
import { TRANSLATIONS_KEYS } from "@/i18n/translation-constants";
import InputFileLarge2 from "@/components/custom-inputs/input-file-large-2";
import { TRANSLATIONS_KEYS_2 } from "@/i18n/translation-keys";

interface Props {
  form: UseFormReturn<BienFormInput, any, BienFormOutput>;
  isPending?: boolean;
}
export default function Images({ form, isPending = false }: Props) {
  const translation = useTranslations();
  return (
    <Section header={translation(TRANSLATIONS_KEYS_2.BIENS.FORM.TITLES.SECTIONS.IMAGES)}>
      <InputFileLarge2 control={form.control as Control<BienFormInput, any, any>} name="images" form={form} />
    </Section>
  );
}

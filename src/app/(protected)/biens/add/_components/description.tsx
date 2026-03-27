import React from "react";
import Section from "./section";
import InputTextArea from "@/components/custom-inputs/input-textarea";
import { Control, UseFormReturn } from "react-hook-form";
import { useTranslations } from "next-intl";
import { BienFormInput, BienFormOutput } from "@/schemas/biens/bien-form.schema";
import { TRANSLATIONS_KEYS } from "@/i18n/translation-constants";

interface Props {
  form: UseFormReturn<BienFormInput, any, BienFormOutput>;
  isPending?: boolean;
}
export default function Description({ form }: Props) {
  const translation = useTranslations();
  return (
    <Section header={translation(TRANSLATIONS_KEYS.BIENS.FORM.DESCRIPTION)}>
      <InputTextArea control={form.control as Control<BienFormInput, any, any>} name="description" />
    </Section>
  );
}

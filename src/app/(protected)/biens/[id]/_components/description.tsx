import React from "react";
import Section from "./section";
import InputTextArea from "@/components/custom-inputs/input-textarea";
import { UseFormReturn } from "react-hook-form";
import { useTranslations } from "next-intl";
import { BienForm } from "@/schemas/biens/bien-form.schema";
import { TRANSLATIONS_KEYS } from "@/i18n/translation-constants";

interface Props {
  form: UseFormReturn<BienForm>;
  isPending?: boolean;
}
export default function Description({ form, isPending = false }: Props) {
  const translation = useTranslations();
  return (
    <Section header={translation(TRANSLATIONS_KEYS.BIENS.FORM.DESCRIPTION)}>
      <InputTextArea control={form.control} name="description" />
    </Section>
  );
}

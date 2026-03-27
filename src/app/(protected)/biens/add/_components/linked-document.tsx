import { useTranslations } from "next-intl";
import React from "react";
import { Control, UseFormReturn } from "react-hook-form";
import Section from "./section";
import { BienFormInput, BienFormOutput } from "@/schemas/biens/bien-form.schema";
import { TRANSLATIONS_KEYS } from "@/i18n/translation-constants";
import InputFileLarge2 from "@/components/custom-inputs/input-file-large-2";

interface Props {
  form: UseFormReturn<BienFormInput, any, BienFormOutput>;
  isPending?: boolean;
}
export default function LinkedDocuments({ form, isPending = false }: Props) {
  const translation = useTranslations();
  return (
    <Section header={translation(TRANSLATIONS_KEYS.BIENS.FORM.LINKED_DOCUMENTS)}>
      <InputFileLarge2 control={form.control as Control<BienFormInput, any, any>} name="documents" form={form} />
    </Section>
  );
}

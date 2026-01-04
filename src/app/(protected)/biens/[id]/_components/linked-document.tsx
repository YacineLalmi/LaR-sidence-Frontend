import { InputFileLarge } from "@/components/custom-inputs/input-file-large";
import { useTranslations } from "next-intl";
import React from "react";
import { UseFormReturn } from "react-hook-form";
import Section from "./section";
import { BienForm } from "@/schemas/biens/bien-form.schema";
import { TRANSLATIONS_KEYS } from "@/i18n/translation-constants";
import InputFileLarge2 from "@/components/custom-inputs/input-file-large-2";

interface Props {
  form: UseFormReturn<BienForm>;
  isPending?: boolean;
}
export default function LinkedDocuments({ form, isPending = false }: Props) {
  const translation = useTranslations();
  return (
    <Section header={translation(TRANSLATIONS_KEYS.BIENS.FORM.LINKED_DOCUMENTS)}>
      <InputFileLarge2 control={form.control} name="documents" form={form} />
    </Section>
  );
}

"use client";

import InputTextArea from "@/components/custom-inputs/input-textarea";
import { useTranslations } from "next-intl";
import { UseFormReturn } from "react-hook-form";
import Section from "./section";
import { BienForm } from "@/schemas/biens/bien-form.schema";
import { TRANSLATIONS_KEYS_2 } from "@/i18n/translation-keys";

interface Props {
  form: UseFormReturn<BienForm>;
  isPending?: boolean;
}
export default function Documents({ form, isPending = false }: Props) {
  const translation = useTranslations();
  return (
    <Section header={translation(TRANSLATIONS_KEYS_2.BIENS.FORM.TITLES.SECTIONS.LINKED_DOCUMENTS)}>
      <InputTextArea control={form.control} name="comment" rows={10} disabled={isPending} />
    </Section>
  );
}

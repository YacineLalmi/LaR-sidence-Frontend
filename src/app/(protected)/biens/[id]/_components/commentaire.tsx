import InputTextArea from "@/components/custom-inputs/input-textarea";
import { useTranslations } from "next-intl";
import React from "react";
import { UseFormReturn } from "react-hook-form";
import Section from "./section";
import { BienForm } from "@/schemas/biens/bien-form.schema";
import { TRANSLATIONS_KEYS } from "@/i18n/translation-constants";

interface Props {
  form: UseFormReturn<BienForm>;
  isPending?: boolean;
}
export default function Commentaire({ form, isPending = false }: Props) {
  const t = useTranslations();
  return (
    <Section header={t(TRANSLATIONS_KEYS.BIENS.FORM.COMMENT)}>
      <InputTextArea control={form.control} name="comment" rows={10} />
    </Section>
  );
}

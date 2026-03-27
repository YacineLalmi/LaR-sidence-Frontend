import InputTextArea from "@/components/custom-inputs/input-textarea";
import { useTranslations } from "next-intl";
import React from "react";
import { Control, UseFormReturn } from "react-hook-form";
import Section from "./section";
import { BienFormInput, BienFormOutput } from "@/schemas/biens/bien-form.schema";
import { TRANSLATIONS_KEYS } from "@/i18n/translation-constants";

interface Props {
  form: UseFormReturn<BienFormInput, any, BienFormOutput>;
  isPending?: boolean;
}
export default function Commentaire({ form, isPending = false }: Props) {
  const t = useTranslations();
  return (
    <Section header={t(TRANSLATIONS_KEYS.BIENS.FORM.COMMENT)}>
      <InputTextArea control={form.control as Control<BienFormInput, any, any>} name="comment" rows={10} />
    </Section>
  );
}

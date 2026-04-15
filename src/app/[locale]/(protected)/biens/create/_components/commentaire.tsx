"use client";
import InputTextArea from "@/components/custom-inputs/input-textarea";
import { useTranslations } from "next-intl";
import { Control, UseFormReturn } from "react-hook-form";
import Section from "./section";
import { BienFormInput, BienFormOutput } from "@/schemas/biens/bien-form.schema";
import { TRANSLATIONS_KEYS_2 } from "@/i18n/translation-keys";

interface Props {
  form: UseFormReturn<BienFormInput, any, BienFormOutput>;
  isPending?: boolean;
}
export default function Commentaire({ form, isPending = false }: Props) {
  const t = useTranslations();
  return (
    <Section header={t(TRANSLATIONS_KEYS_2.BIENS.FORM.TITLES.SECTIONS.COMMENT)}>
      <InputTextArea control={form.control as Control<BienFormInput, any, any>} name="comment" rows={10} />
    </Section>
  );
}

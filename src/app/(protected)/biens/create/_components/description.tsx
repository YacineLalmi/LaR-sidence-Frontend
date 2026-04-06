"use client"
import Section from "./section";
import InputTextArea from "@/components/custom-inputs/input-textarea";
import { Control, UseFormReturn } from "react-hook-form";
import { useTranslations } from "next-intl";
import { BienFormInput, BienFormOutput } from "@/schemas/biens/bien-form.schema";
import { TRANSLATIONS_KEYS_2 } from "@/i18n/translation-keys";

interface Props {
  form: UseFormReturn<BienFormInput, any, BienFormOutput>;
  isPending?: boolean;
}
export default function Description({ form }: Props) {
  const translation = useTranslations();
  return (
    <Section header={translation(TRANSLATIONS_KEYS_2.BIENS.FORM.TITLES.SECTIONS.DESCRIPTION)}>
      <InputTextArea control={form.control as Control<BienFormInput, any, any>} name="description" />
    </Section>
  );
}

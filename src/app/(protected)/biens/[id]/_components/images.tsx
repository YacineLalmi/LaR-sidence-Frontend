import { InputFileLarge } from "@/components/custom-inputs/input-file-large";
import React from "react";
import { UseFormReturn } from "react-hook-form";
import Section from "./section";
import { useTranslations } from "next-intl";
import { BienForm } from "@/schemas/biens/bien-form.schema";
import { TRANSLATIONS_KEYS } from "@/i18n/translation-constants";
import InputFileLarge2 from "@/components/custom-inputs/input-file-large-2";

interface Props {
  form: UseFormReturn<BienForm>;
  isPending?: boolean;
}
export default function Images({ form, isPending = false }: Props) {
  const t = useTranslations();
  return (
    <Section header={t(TRANSLATIONS_KEYS.BIENS.FORM.IMAGES)}>
      <InputFileLarge2 control={form.control} name="images" form={form} />
    </Section>
  );
}

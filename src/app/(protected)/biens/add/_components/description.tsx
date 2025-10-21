import React from "react";
import Section from "./section";
import InputTextArea from "@/components/custom-inputs/input-textarea";
import { UseFormReturn } from "react-hook-form";
import { useTranslations } from "next-intl";
import { BienForm } from "@/schemas/biens/bien-form.schema";

interface Props {
  form: UseFormReturn<BienForm>;
  isPending?: boolean;
}
export default function Description({ form, isPending = false }: Props) {
  const t = useTranslations();
  return (
    <Section header={t("biens.create.form.description.header")}>
      <InputTextArea control={form.control} name="description" />
    </Section>
  );
}

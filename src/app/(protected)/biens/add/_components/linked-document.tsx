import { InputFileLarge } from "@/components/custom-inputs/input-file-large";
import { useTranslations } from "next-intl";
import React from "react";
import { UseFormReturn } from "react-hook-form";
import Section from "./section";
import { BienForm } from "@/schemas/biens/bien-form.schema";

interface Props {
  form: UseFormReturn<BienForm>;
  isPending?: boolean;
}
export default function LinkedDocuments({ form, isPending = false }: Props) {
  const t = useTranslations();
  return (
    <Section header={t("biens.create.form.linkedDocuments.header")}>
      <InputFileLarge control={form.control} name="documents" />
    </Section>
  );
}

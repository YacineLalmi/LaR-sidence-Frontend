import { InputFileLarge } from "@/components/custom-inputs/input-file-large";
import React from "react";
import { UseFormReturn } from "react-hook-form";
import Section from "./section";
import { useTranslations } from "next-intl";
import { BienForm } from "@/schemas/biens/bien-form.schema";

interface Props {
  form: UseFormReturn<BienForm>;
  isPending?: boolean;
}
export default function Images({ form, isPending = false }: Props) {
  const t = useTranslations();
  return (
    <Section header={t("biens.create.form.images.header")}>
      <InputFileLarge control={form.control} name="images" />
    </Section>
  );
}

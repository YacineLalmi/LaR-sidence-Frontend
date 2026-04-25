import { Control, UseFormReturn } from "react-hook-form";
import Section from "./section";
import { useTranslations } from "next-intl";
import { BienFormInput, BienFormOutput } from "@/schemas/biens/bien-form.schema";
import { TRANSLATIONS_KEYS_2 } from "@/i18n/translation-keys";
import InputFileLarge from "@/components/custom-inputs/input-file/index";

interface Props {
  form: UseFormReturn<BienFormInput, any, BienFormOutput>;
  isPending?: boolean;
}
export default function Images({ form, isPending = false }: Props) {
  const translation = useTranslations();
  return (
    <Section header={translation(TRANSLATIONS_KEYS_2.BIENS.FORM.TITLES.SECTIONS.LINKED_DOCUMENTS)}>
      <InputFileLarge
        control={form.control as Control<BienFormInput, any, any>}
        name="documents"
        areFileLoading={isPending}
      />
    </Section>
  );
}

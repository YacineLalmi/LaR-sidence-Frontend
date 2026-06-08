import { Control, UseFormReturn } from "react-hook-form";
import Section from "./section";
import { useTranslations } from "next-intl";
import { BienFormInput, BienFormOutput } from "@/schemas/biens/bien-form.schema";
import { TRANSLATIONS_KEYS_2 } from "@/i18n/translation-keys";
import InputFileLarge from "@/components/custom-inputs/input-file/index";

interface Props {
  form: UseFormReturn<BienFormInput, any, BienFormOutput>;
  isPending?: boolean;
  existingDocuments: File[];
  setExistingDocuments: React.Dispatch<React.SetStateAction<File[]>>;
}
export default function LinkedDocuments({ form, isPending = false, existingDocuments, setExistingDocuments }: Props) {
  const translation = useTranslations();

  const handleFileDelete = (file: File, index: number) => {
    // Track the deleted UUID in the form
    const current = form.getValues("deleted_documents") ?? [];
    const uuid = file.name.split("#").pop() || ""; // Extract UUID from filename
    if (uuid) {
      form.setValue("deleted_documents", [...current, uuid]);
    }
    setExistingDocuments?.((prev) => prev.filter((doc, docIndex) => docIndex !== index));
  };

  const handleNewFiles = (files: File[]) => {
    setExistingDocuments?.((prev) => [...(prev || []), ...files]);
    form.setValue("new_documents", files);
  };

  return (
    <Section header={translation(TRANSLATIONS_KEYS_2.BIENS.FORM.TITLES.SECTIONS.LINKED_DOCUMENTS)}>
      <InputFileLarge
        control={form.control as Control<BienFormInput, any, any>}
        name="new_documents"
        accept={[
          "application/msword",
          "application/pdf",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ]}
        areFileLoading={isPending}
        existingFiles={existingDocuments}
        handleNewFiles={handleNewFiles}
        handleFileDelete={handleFileDelete}
      />
    </Section>
  );
}

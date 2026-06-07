import { Control, UseFormReturn } from "react-hook-form";
import Section from "./section";
import { useTranslations } from "next-intl";
import { BienFormInput, BienFormOutput } from "@/schemas/biens/bien-form.schema";
import { TRANSLATIONS_KEYS_2 } from "@/i18n/translation-keys";
import InputFileLarge from "@/components/custom-inputs/input-file/index";

interface Props {
  form: UseFormReturn<BienFormInput, any, BienFormOutput>;
  isPending?: boolean;
  existingImages?: File[];
  setExistingImages?: React.Dispatch<React.SetStateAction<File[]>>;
}
export default function Images({ form, isPending = false, existingImages, setExistingImages }: Props) {
  const translation = useTranslations();

  const handleDelete = (file: File, index: number) => {
    // Track the deleted UUID in the form
    const current = form.getValues("deleted_images") ?? [];
    const uuid = file.name.split("#").pop() || ""; // Extract UUID from filename
    if (uuid) {
      form.setValue("deleted_images", [...current, uuid]);
    }
    setExistingImages?.((prev) => prev.filter((img, imgIndex) => imgIndex !== index));
  };

  const handleNewFiles = (files: File[]) => {
    setExistingImages?.((prev) => [...(prev || []), ...files]);
    form.setValue("new_images", files);
  };
  return (
    <Section header={translation(TRANSLATIONS_KEYS_2.BIENS.FORM.TITLES.SECTIONS.IMAGES)}>
      <InputFileLarge
        control={form.control as Control<BienFormInput, any, any>}
        name="images"
        areFileLoading={isPending}
        existingFiles={existingImages}
        handleNewFiles={handleNewFiles}
        handleFileDelete={handleDelete}
      />
    </Section>
  );
}

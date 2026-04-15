"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { Plus } from "lucide-react";
import FormDialog from "@/components/form-dialog/form-dialog";
import CustomButton from "@/components/ui/custom-button";
import { CommuneForm as CommuneFormType } from "@/schemas/communes/commune-form.schema";
import { createCommuneAction } from "@/actions/commune/create-commune.action";
import { ListItem } from "@/schemas/global.schema";
import { TRANSLATIONS_KEYS_2 } from "@/i18n/translation-keys";
import CommuneForm from "./commune-form";

const FORM_ID = "create-commune-form";

interface Props {
  wilayas: ListItem[];
}

export default function CreateCommuneDialog({ wilayas }: Props) {
  const [isPending, setIsPending] = useState<boolean>(false);
  const router = useRouter();
  const translation = useTranslations();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const initialData = {
    wilaya_id: "",
    name: {
      fr: "",
      en: "",
      ar: "",
    },
    post_code: "",
  };

  const submitAction = useCallback(async (values: CommuneFormType) => {
    setIsPending(true);
    const response = await createCommuneAction(values);
    setIsPending(false);
    return response;
  }, []);

  const onSuccess = useCallback(() => {
    setIsOpen(false);
    router.refresh();
  }, [router]);

  const handleDialogOpen = useCallback((isOpen: boolean) => {
    setIsOpen(isOpen);
  }, []);

  return (
    <FormDialog
      formId={FORM_ID}
      isOpen={isOpen}
      onOpenChange={handleDialogOpen}
      submitButtonText={translation(TRANSLATIONS_KEYS_2.COMMON.BUTTONS.ADD)}
      isPending={isPending}
      title={translation(TRANSLATIONS_KEYS_2.SETTINGS.LOCATIONS.COMMUNES.FORM.TITLES.CREATE)}
      trigger={
        <CustomButton text={translation(TRANSLATIONS_KEYS_2.SETTINGS.LOCATIONS.COMMUNES.CREATE_TEXT)} Icon={Plus} />
      }
      preventOutsideClick={true}
    >
      <CommuneForm
        wilayas={wilayas}
        initialData={initialData}
        submitAction={submitAction}
        successMessage={TRANSLATIONS_KEYS_2.SETTINGS.COLORS.FORM.MESSAGES.CREATED}
        errorMessage={TRANSLATIONS_KEYS_2.SETTINGS.COLORS.FORM.MESSAGES.FAILED_CREATION}
        formId={FORM_ID}
        successAction={onSuccess}
      />
    </FormDialog>
  );
}

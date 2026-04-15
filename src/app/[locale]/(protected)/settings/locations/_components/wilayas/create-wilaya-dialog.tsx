"use client";

import { createWilayaAction } from "@/actions/wilayas/create-wilaya.action";
import { WilayaForm as WilayaFormType } from "@/schemas/wilayas/wilaya-form.schema";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { Plus } from "lucide-react";
import FormDialog from "@/components/form-dialog/form-dialog";
import CustomButton from "@/components/ui/custom-button";
import { TRANSLATIONS_KEYS_2 } from "@/i18n/translation-keys";
import WilayaForm from "./wilaya-form";

const FORM_ID = "create-wilaya-form";

export default function CreateWilayaDialog() {
  const [isPending, setIsPending] = useState<boolean>(false);
  const router = useRouter();
  const translation = useTranslations();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const wilaya: WilayaFormType = {
    code: "",
    name: {
      fr: "",
      en: "",
      ar: "",
    },
  };

  const submitAction = useCallback(async (values: WilayaFormType) => {
    setIsPending(true);
    const response = await createWilayaAction(values);
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
      title={translation(TRANSLATIONS_KEYS_2.SETTINGS.LOCATIONS.WILAYAS.FORM.TITLES.CREATE)}
      trigger={
        <CustomButton text={translation(TRANSLATIONS_KEYS_2.SETTINGS.LOCATIONS.WILAYAS.CREATE_TEXT)} Icon={Plus} />
      }
      preventOutsideClick={true}
    >
      <WilayaForm
        formId={FORM_ID}
        initialData={wilaya}
        submitAction={submitAction}
        successMessage={TRANSLATIONS_KEYS_2.SETTINGS.LOCATIONS.WILAYAS.FORM.MESSAGES.CREATED}
        errorMessage={TRANSLATIONS_KEYS_2.SETTINGS.LOCATIONS.WILAYAS.FORM.MESSAGES.FAILED_CREATION}
        successAction={onSuccess}
      />
    </FormDialog>
  );
}

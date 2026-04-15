"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { Edit } from "lucide-react";
import { updateWilayaAction } from "@/actions/wilayas/update-wilaya.action";
import { Wilaya } from "@/schemas/wilayas/wilaya.schema";
import FormDialog from "@/components/form-dialog/form-dialog";
import CustomButton from "@/components/ui/custom-button";
import { TRANSLATIONS_KEYS_2 } from "@/i18n/translation-keys";
import WilayaForm from "./wilaya-form";
import { WilayaForm as WilayaFormType } from "@/schemas/wilayas/wilaya-form.schema";

const FORM_ID = "update-wilaya-form";

interface Props {
  wilaya: Wilaya;
}

export default function UpdateWilayaDialog({ wilaya }: Props) {
  const [isPending, setIsPending] = useState<boolean>(false);
  const router = useRouter();
  const translation = useTranslations();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const submitAction = useCallback(
    async (values: WilayaFormType) => {
      setIsPending(true);
      const response = await updateWilayaAction(values, wilaya.id);
      setIsPending(false);
      return response;
    },
    [wilaya.id],
  );

  const successAction = useCallback(() => {
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
      submitButtonText={translation(TRANSLATIONS_KEYS_2.COMMON.BUTTONS.APPLY)}
      isPending={isPending}
      title={translation(TRANSLATIONS_KEYS_2.SETTINGS.LOCATIONS.WILAYAS.FORM.TITLES.EDIT)}
      trigger={<CustomButton Icon={Edit} size="icon" variant="ghost" className="p-0" />}
      preventOutsideClick={true}
    >
      <WilayaForm
        submitAction={submitAction}
        errorMessage={TRANSLATIONS_KEYS_2.SETTINGS.LOCATIONS.WILAYAS.FORM.MESSAGES.FAILED_UPDATE}
        successMessage={TRANSLATIONS_KEYS_2.SETTINGS.LOCATIONS.WILAYAS.FORM.MESSAGES.UPDATED}
        formId={FORM_ID}
        initialData={wilaya}
        successAction={successAction}
      />
    </FormDialog>
  );
}

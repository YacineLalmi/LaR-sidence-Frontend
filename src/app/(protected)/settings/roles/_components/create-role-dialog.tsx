"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { Plus } from "lucide-react";
import FormDialog from "@/components/form-dialog/form-dialog";
import CustomButton from "@/components/ui/custom-button";
import { RoleForm as RoleFormType, RoleFormSchema } from "@/schemas/roles/role-form.schema";
import { createRoleAction } from "@/actions/roles/create-role.action";
import { PermissionCategory } from "@/schemas/permissions/permission-category.schema";
import RoleForm from "./role-form";
import { TRANSLATIONS_KEYS_2 } from "@/i18n/translation-keys";

const FORM_ID = "create-role-form";
interface Props {
  permissions: PermissionCategory[];
}

export default function CreateRoleDialog({ permissions }: Props) {
  const [isPending, setIsPending] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const router = useRouter();
  const translation = useTranslations();

  const initialData: RoleFormType = {
    display_name: "",
    description: "",
    permissions: [],
  };

  const submitAction = useCallback(async (values: RoleFormType) => {
    setIsPending(true);
    const response = await createRoleAction(values);
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
      title={translation(TRANSLATIONS_KEYS_2.SETTINGS.ROLES.FORM.TITLES.CREATE)}
      trigger={<CustomButton text={translation(TRANSLATIONS_KEYS_2.SETTINGS.ROLES.FORM.BUTTONS.CREATE)} Icon={Plus} />}
      preventOutsideClick={true}
    >
      <RoleForm
        permissions={permissions}
        initialData={initialData}
        submitAction={submitAction}
        successMessage={TRANSLATIONS_KEYS_2.SETTINGS.ROLES.FORM.MESSAGES.CREATED}
        errorMessage={TRANSLATIONS_KEYS_2.SETTINGS.COLORS.FORM.MESSAGES.FAILED_CREATION}
        formId={FORM_ID}
        successAction={onSuccess}
      />
    </FormDialog>
  );
}

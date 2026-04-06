"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { Edit } from "lucide-react";
import FormDialog from "@/components/form-dialog/form-dialog";
import CustomButton from "@/components/ui/custom-button";
import { RoleForm as RoleFormType } from "@/schemas/roles/role-form.schema";
import { PermissionCategory } from "@/schemas/permissions/permission-category.schema";
import RoleForm from "./role-form";
import { TRANSLATIONS_KEYS_2 } from "@/i18n/translation-keys";
import { Role } from "@/schemas/roles/role.schema";
import { updateRoleAction } from "@/actions/roles/update-role.action";

const FORM_ID = "create-role-form";
interface Props {
  permissions: PermissionCategory[];
  role: Role;
}

export default function UpdateRoleDialog({ permissions, role }: Props) {
  const [isPending, setIsPending] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const router = useRouter();
  const translation = useTranslations();

  const initialDate: RoleFormType = {
    display_name: role.display_name,
    description: role.description,
    permissions: role.permissions?.map((permission) => permission.id) ?? [],
  };
  const submitAction = useCallback(async (values: RoleFormType) => {
    setIsPending(true);
    const response = await updateRoleAction(values, role.id);
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
      submitButtonText={translation(TRANSLATIONS_KEYS_2.COMMON.BUTTONS.APPLY)}
      isPending={isPending}
      title={translation(TRANSLATIONS_KEYS_2.SETTINGS.ROLES.FORM.TITLES.UPDATE)}
      trigger={<CustomButton Icon={Edit} size="icon" variant="ghost" className="!p-0" />}
      preventOutsideClick={true}
    >
      <RoleForm
        permissions={permissions}
        initialData={initialDate}
        submitAction={submitAction}
        successMessage={TRANSLATIONS_KEYS_2.SETTINGS.ROLES.FORM.MESSAGES.CREATED}
        errorMessage={TRANSLATIONS_KEYS_2.SETTINGS.COLORS.FORM.MESSAGES.FAILED_CREATION}
        formId={FORM_ID}
        successAction={onSuccess}
      />
    </FormDialog>
  );
}

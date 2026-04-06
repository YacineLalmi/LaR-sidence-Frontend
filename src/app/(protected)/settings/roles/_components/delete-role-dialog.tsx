import { deleteRoleAction } from "@/actions/roles/delete-role.action";
import CustomButton from "@/components/ui/custom-button";
import { DeleteConfirmationDialog } from "@/components/ui/delete-confirmation-dialog";
import { TRANSLATIONS_KEYS_2 } from "@/i18n/translation-keys";
import { Role } from "@/schemas/roles/role.schema";
import { Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

interface Props {
  role: Role;
}
export default function DeleteRoleDialog({ role }: Props) {
  const translation = useTranslations();
  const router = useRouter();
  const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false);

  const onSuccess = useCallback(() => {
    setIsDeleteOpen(false);
    router.refresh();
  }, []);

  return (
    <DeleteConfirmationDialog
      title={translation(TRANSLATIONS_KEYS_2.SETTINGS.ROLES.FORM.MESSAGES.DELETE_CONFIRMATION, { id: role.id })}
      isOpen={isDeleteOpen}
      setIsOpen={setIsDeleteOpen}
      confirmAction={() => deleteRoleAction(role.id)}
      onSuccess={onSuccess}
      successMessage={TRANSLATIONS_KEYS_2.SETTINGS.ROLES.FORM.MESSAGES.DELETED}
      errorMessage={TRANSLATIONS_KEYS_2.SETTINGS.ROLES.FORM.MESSAGES.FAILED_DELETION}
      trigger={<CustomButton Icon={Trash2} size="icon" variant="ghost" className="!p-0" />}
    />
  );
}

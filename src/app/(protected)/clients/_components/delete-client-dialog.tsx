import { deleteClientAction } from "@/actions/clients/delete-client.action";
import CustomButton from "@/components/ui/custom-button";
import { DeleteConfirmationDialog } from "@/components/ui/delete-confirmation-dialog";
import { TRANSLATIONS_KEYS_2 } from "@/i18n/translation-keys";
import { Client } from "@/schemas/clients/client.schema";
import { Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

interface Props {
  client: Client;
}
export default function DeleteClientDialog({ client }: Props) {
  const translation = useTranslations();
  const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false);
  const router = useRouter();

  const onSuccess = useCallback(() => {
    setIsDeleteOpen(false);
    router.refresh();
  }, []);

  return (
    <DeleteConfirmationDialog
      title={translation(TRANSLATIONS_KEYS_2.CLIENTS.FORM.MESSAGES.DELETE_CONFIRMATION, { id: client.id })}
      isOpen={isDeleteOpen}
      setIsOpen={setIsDeleteOpen}
      confirmAction={() => deleteClientAction(client.id)}
      onSuccess={onSuccess}
      successMessage={TRANSLATIONS_KEYS_2.CLIENTS.FORM.MESSAGES.DELETED}
      errorMessage={TRANSLATIONS_KEYS_2.CLIENTS.FORM.MESSAGES.FAILED_DELETION}
      trigger={<CustomButton Icon={Trash2} size="icon" variant="ghost" className="!p-0 size-7" />}
    />
  );
}

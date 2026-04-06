"use client";
import { deleteOfferAction } from "@/actions/offers/delete-offer.action";
import CustomButton from "@/components/ui/custom-button";
import { DeleteConfirmationDialog } from "@/components/ui/delete-confirmation-dialog";
import { TRANSLATIONS_KEYS_2 } from "@/i18n/translation-keys";
import { Offer } from "@/schemas/offers/offer.schema";
import { Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

interface Props {
  offer: Offer;
}
export default function DeleteOfferDialog({ offer }: Props) {
  const translation = useTranslations();
  const router = useRouter();
  const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false);

  const onSuccess = useCallback(() => {
    setIsDeleteOpen(false);
    router.refresh();
  }, []);

  return (
    <DeleteConfirmationDialog
      title={translation(TRANSLATIONS_KEYS_2.OFFERS.FORM.MESSAGES.DELETE_CONFIRMATION, { id: offer.id })}
      isOpen={isDeleteOpen}
      setIsOpen={setIsDeleteOpen}
      confirmAction={() => deleteOfferAction(offer.id)}
      onSuccess={onSuccess}
      successMessage={TRANSLATIONS_KEYS_2.OFFERS.FORM.MESSAGES.DELETED}
      errorMessage={TRANSLATIONS_KEYS_2.OFFERS.FORM.MESSAGES.FAILED_DELETION}
      trigger={<CustomButton Icon={Trash2} size="icon" variant="ghost" className="!p-0 size-7" />}
    />
  );
}

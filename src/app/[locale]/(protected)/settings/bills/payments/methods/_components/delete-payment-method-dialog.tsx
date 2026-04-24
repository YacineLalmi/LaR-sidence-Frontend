"use client";
import { TRANSLATIONS_KEYS_2 } from "@/i18n/translation-keys";
import { CATEGORIES, SCOPES } from "@/services/classification.service";
import { Classification } from "@/schemas/classification/classification.schema";
import { useTranslations } from "next-intl";
import DeleteClassificationDialog from "../../../../_components/delete-classification-dialog";

interface Props {
  classification: Classification;
}
export default function DeletedPaymentMethodDialog({ classification }: Props) {
  const translation = useTranslations();
  return (
    <DeleteClassificationDialog
      category={CATEGORIES.METHOD}
      scope={SCOPES.PAYMENT}
      classification={classification}
      confirmationMessage={translation(
        TRANSLATIONS_KEYS_2.SETTINGS.BILLS.PAYMENTS.METHODS.FORM.MESSAGES.DELETE_CONFIRMATION,
        {
          id: classification.id,
        },
      )}
      successMessage={TRANSLATIONS_KEYS_2.SETTINGS.BILLS.PAYMENTS.METHODS.FORM.MESSAGES.DELETED}
      errorMessage={TRANSLATIONS_KEYS_2.SETTINGS.BILLS.PAYMENTS.METHODS.FORM.MESSAGES.FAILED_DELETION}
    />
  );
}

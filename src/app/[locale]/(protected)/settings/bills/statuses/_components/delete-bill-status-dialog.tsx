"use client";
import { TRANSLATIONS_KEYS_2 } from "@/i18n/translation-keys";
import DeleteClassificationDialog from "../../../_components/delete-classification-dialog";
import { CATEGORIES, SCOPES } from "@/services/classification.service";
import { Classification } from "@/schemas/classification/classification.schema";
import { useTranslations } from "next-intl";

interface Props {
  classification: Classification;
}
export default function DeleteBillStatusDialog({ classification }: Props) {
  const translation = useTranslations();
  return (
    <DeleteClassificationDialog
      category={CATEGORIES.STATUS}
      scope={SCOPES.BILL}
      classification={classification}
      confirmationMessage={translation(TRANSLATIONS_KEYS_2.SETTINGS.BILLS.STATUSES.FORM.MESSAGES.DELETE_CONFIRMATION, {
        id: classification.id,
      })}
      successMessage={TRANSLATIONS_KEYS_2.SETTINGS.BILLS.STATUSES.FORM.MESSAGES.DELETED}
      errorMessage={TRANSLATIONS_KEYS_2.SETTINGS.BILLS.STATUSES.FORM.MESSAGES.FAILED_DELETION}
    />
  );
}

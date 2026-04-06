"use client";
import { TRANSLATIONS_KEYS_2 } from "@/i18n/translation-keys";
import DeleteClassificationDialog from "../../../_components/delete-classification-dialog";
import { CATEGORIES, SCOPES } from "@/services/classification.service";
import { Classification } from "@/schemas/classification/classification.schema";
import { useTranslations } from "next-intl";

interface Props {
  classification: Classification;
}
export default function DeleteBienStatusDialog({ classification }: Props) {
  const translation = useTranslations();
  return (
    <DeleteClassificationDialog
      category={CATEGORIES.STATUS}
      scope={SCOPES.BIEN}
      classification={classification}
      confirmationMessage={translation(TRANSLATIONS_KEYS_2.SETTINGS.BIENS.STATUSES.FORM.MESSAGES.DELETE_CONFIRMATION, {
        id: classification.id,
      })}
      successMessage={TRANSLATIONS_KEYS_2.SETTINGS.BIENS.STATUSES.FORM.MESSAGES.DELETED}
      errorMessage={TRANSLATIONS_KEYS_2.SETTINGS.BIENS.STATUSES.FORM.MESSAGES.FAILED_DELETION}
    />
  );
}

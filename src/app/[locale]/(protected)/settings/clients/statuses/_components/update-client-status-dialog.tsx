"use client";

import { CATEGORIES, SCOPES } from "@/services/classification.service";
import { TRANSLATIONS_KEYS_2 } from "@/i18n/translation-keys";
import UpdateClassificationDialog from "../../../_components/update-classification-dialog";
import { Classification } from "@/schemas/classification/classification.schema";

interface Props {
  classification: Classification;
}
export default function UpdateClientStatusDialog({ classification }: Props) {
  return (
    <UpdateClassificationDialog
      title={TRANSLATIONS_KEYS_2.SETTINGS.CLIENTS.STATUSES.FORM.TITLES.UPDATE}
      classification={classification}
      category={CATEGORIES.STATUS}
      scope={SCOPES.CLEINT}
      errorMessage={TRANSLATIONS_KEYS_2.SETTINGS.CLIENTS.STATUSES.FORM.MESSAGES.FAILED_CREATION}
      successMessage={TRANSLATIONS_KEYS_2.SETTINGS.CLIENTS.STATUSES.FORM.MESSAGES.CREATED}
    />
  );
}

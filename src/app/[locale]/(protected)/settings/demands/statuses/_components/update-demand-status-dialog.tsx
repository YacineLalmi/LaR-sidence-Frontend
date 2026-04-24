"use client";

import { CATEGORIES, SCOPES } from "@/services/classification.service";
import { TRANSLATIONS_KEYS_2 } from "@/i18n/translation-keys";
import UpdateClassificationDialog from "../../../_components/update-classification-dialog";
import { Classification } from "@/schemas/classification/classification.schema";

interface Props {
  classification: Classification;
}
export default function UpdateDemandStatusDialog({ classification }: Props) {
  return (
    <UpdateClassificationDialog
      title={TRANSLATIONS_KEYS_2.SETTINGS.DEMANDS.STATUSES.FORM.TITLES.UPDATE}
      classification={classification}
      category={CATEGORIES.STATUS}
      scope={SCOPES.DEMAND}
      errorMessage={TRANSLATIONS_KEYS_2.SETTINGS.DEMANDS.STATUSES.FORM.MESSAGES.FAILED_CREATION}
      successMessage={TRANSLATIONS_KEYS_2.SETTINGS.DEMANDS.STATUSES.FORM.MESSAGES.CREATED}
    />
  );
}

"use client";

import { CATEGORIES, SCOPES } from "@/services/classification.service";
import { TRANSLATIONS_KEYS_2 } from "@/i18n/translation-keys";
import UpdateClassificationDialog from "../../../_components/update-classification-dialog";
import { Classification } from "@/schemas/classification/classification.schema";

interface Props {
  classification: Classification;
}
export default function UpdateDemandTypeDialog({ classification }: Props) {
  return (
    <UpdateClassificationDialog
      title={TRANSLATIONS_KEYS_2.SETTINGS.DEMANDS.TYPES.FORM.TITLES.UPDATE}
      classification={classification}
      category={CATEGORIES.TYPE}
      scope={SCOPES.DEMAND}
      errorMessage={TRANSLATIONS_KEYS_2.SETTINGS.DEMANDS.TYPES.FORM.MESSAGES.FAILED_CREATION}
      successMessage={TRANSLATIONS_KEYS_2.SETTINGS.DEMANDS.TYPES.FORM.MESSAGES.CREATED}
    />
  );
}

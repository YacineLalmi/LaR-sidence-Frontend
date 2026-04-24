"use client";

import { CATEGORIES, SCOPES } from "@/services/classification.service";
import { ListItem } from "@/schemas/global.schema";
import { TRANSLATIONS_KEYS_2 } from "@/i18n/translation-keys";
import UpdateClassificationDialog from "../../../_components/update-classification-dialog";
import { Classification } from "@/schemas/classification/classification.schema";

interface Props {
  classification: Classification;
}
export default function UpdateClientTypeDialog({ classification }: Props) {
  return (
    <UpdateClassificationDialog
      title={TRANSLATIONS_KEYS_2.SETTINGS.CLIENTS.TYPES.FORM.TITLES.UPDATE}
      classification={classification}
      category={CATEGORIES.TYPE}
      scope={SCOPES.CLEINT}
      errorMessage={TRANSLATIONS_KEYS_2.SETTINGS.CLIENTS.TYPES.FORM.MESSAGES.FAILED_CREATION}
      successMessage={TRANSLATIONS_KEYS_2.SETTINGS.CLIENTS.TYPES.FORM.MESSAGES.CREATED}
    />
  );
}

"use client";

import CreateClassificationDialog from "../../../_components/create-classification-dialog";
import { CATEGORIES, SCOPES } from "@/services/classification.service";
import { TRANSLATIONS_KEYS_2 } from "@/i18n/translation-keys";

export default function CreateClientTypeDialog() {
  return (
    <CreateClassificationDialog
      category={CATEGORIES.TYPE}
      scope={SCOPES.CLEINT}
      title={TRANSLATIONS_KEYS_2.SETTINGS.CLIENTS.TYPES.FORM.TITLES.CREATE}
      buttonText={TRANSLATIONS_KEYS_2.SETTINGS.CLIENTS.TYPES.FORM.BUTTONS.CREATE}
      errorMessage={TRANSLATIONS_KEYS_2.SETTINGS.CLIENTS.TYPES.FORM.MESSAGES.FAILED_CREATION}
      successMessage={TRANSLATIONS_KEYS_2.SETTINGS.CLIENTS.TYPES.FORM.MESSAGES.CREATED}
    />
  );
}

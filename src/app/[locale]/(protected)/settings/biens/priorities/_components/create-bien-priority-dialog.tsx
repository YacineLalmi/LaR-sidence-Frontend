"use client";

import CreateClassificationDialog from "../../../_components/create-classification-dialog";
import { CATEGORIES, SCOPES } from "@/services/classification.service";
import { TRANSLATIONS_KEYS_2 } from "@/i18n/translation-keys";

export default function CreateBienPriorityDialog() {
  return (
    <CreateClassificationDialog
      category={CATEGORIES.PRIORITY}
      scope={SCOPES.BIEN}
      title={TRANSLATIONS_KEYS_2.SETTINGS.BIENS.PRIORITIES.FORM.TITLES.CREATE}
      buttonText={TRANSLATIONS_KEYS_2.SETTINGS.BIENS.PRIORITIES.FORM.BUTTONS.CREATE}
      errorMessage={TRANSLATIONS_KEYS_2.SETTINGS.BIENS.PRIORITIES.FORM.MESSAGES.FAILED_CREATION}
      successMessage={TRANSLATIONS_KEYS_2.SETTINGS.BIENS.PRIORITIES.FORM.MESSAGES.CREATED}
    />
  );
}

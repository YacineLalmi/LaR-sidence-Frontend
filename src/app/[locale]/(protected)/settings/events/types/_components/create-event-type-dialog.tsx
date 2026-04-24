"use client";

import CreateClassificationDialog from "../../../_components/create-classification-dialog";
import { CATEGORIES, SCOPES } from "@/services/classification.service";
import { TRANSLATIONS_KEYS_2 } from "@/i18n/translation-keys";

export default function CreateEventTypeDialog() {
  return (
    <CreateClassificationDialog
      category={CATEGORIES.TYPE}
      scope={SCOPES.EVENT}
      title={TRANSLATIONS_KEYS_2.SETTINGS.EVENTS.TYPES.FORM.TITLES.CREATE}
      buttonText={TRANSLATIONS_KEYS_2.SETTINGS.EVENTS.TYPES.FORM.BUTTONS.CREATE}
      errorMessage={TRANSLATIONS_KEYS_2.SETTINGS.EVENTS.TYPES.FORM.MESSAGES.FAILED_CREATION}
      successMessage={TRANSLATIONS_KEYS_2.SETTINGS.EVENTS.TYPES.FORM.MESSAGES.CREATED}
    />
  );
}

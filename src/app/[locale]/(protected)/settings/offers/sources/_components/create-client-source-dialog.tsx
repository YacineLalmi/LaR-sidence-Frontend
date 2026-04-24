"use client";

import CreateClassificationDialog from "../../../_components/create-classification-dialog";
import { CATEGORIES, SCOPES } from "@/services/classification.service";
import { TRANSLATIONS_KEYS_2 } from "@/i18n/translation-keys";

export default function CreateClientSourceDialog() {
  return (
    <CreateClassificationDialog
      category={CATEGORIES.SOURCE}
      scope={SCOPES.CLEINT}
      title={TRANSLATIONS_KEYS_2.SETTINGS.CLIENTS.SOURCES.FORM.TITLES.CREATE}
      buttonText={TRANSLATIONS_KEYS_2.SETTINGS.CLIENTS.SOURCES.FORM.BUTTONS.CREATE}
      errorMessage={TRANSLATIONS_KEYS_2.SETTINGS.CLIENTS.SOURCES.FORM.MESSAGES.FAILED_CREATION}
      successMessage={TRANSLATIONS_KEYS_2.SETTINGS.CLIENTS.SOURCES.FORM.MESSAGES.CREATED}
    />
  );
}

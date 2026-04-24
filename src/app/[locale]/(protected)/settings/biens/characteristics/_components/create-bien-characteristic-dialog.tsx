"use client";

import CreateClassificationDialog from "../../../_components/create-classification-dialog";
import { CATEGORIES, SCOPES } from "@/services/classification.service";
import { ListItem } from "@/schemas/global.schema";
import { TRANSLATIONS_KEYS_2 } from "@/i18n/translation-keys";

export default function CreateBienCharacteristicDialog() {
  return (
    <CreateClassificationDialog
      category={CATEGORIES.CHARACTERISTIC}
      scope={SCOPES.BIEN}
      title={TRANSLATIONS_KEYS_2.SETTINGS.BIENS.CHARACTERISTICS.FORM.TITLES.CREATE}
      buttonText={TRANSLATIONS_KEYS_2.SETTINGS.BIENS.CHARACTERISTICS.FORM.BUTTONS.CREATE}
      errorMessage={TRANSLATIONS_KEYS_2.SETTINGS.BIENS.CHARACTERISTICS.FORM.MESSAGES.FAILED_CREATION}
      successMessage={TRANSLATIONS_KEYS_2.SETTINGS.BIENS.CHARACTERISTICS.FORM.MESSAGES.CREATED}
    />
  );
}

"use client";

import { CATEGORIES, SCOPES } from "@/services/classification.service";
import { ListItem } from "@/schemas/global.schema";
import { TRANSLATIONS_KEYS_2 } from "@/i18n/translation-keys";
import UpdateClassificationDialog from "../../../_components/update-classification-dialog";
import { Classification } from "@/schemas/classification/classification.schema";

interface Props {
  colors: ListItem[];
  classification: Classification;
}
export default function UpdateClientSourceDialog({ colors, classification }: Props) {
  return (
    <UpdateClassificationDialog
      title={TRANSLATIONS_KEYS_2.SETTINGS.CLIENTS.SOURCES.FORM.TITLES.UPDATE}
      classification={classification}
      category={CATEGORIES.SOURCE}
      scope={SCOPES.CLEINT}
      colors={colors}
      errorMessage={TRANSLATIONS_KEYS_2.SETTINGS.CLIENTS.SOURCES.FORM.MESSAGES.FAILED_CREATION}
      successMessage={TRANSLATIONS_KEYS_2.SETTINGS.CLIENTS.SOURCES.FORM.MESSAGES.CREATED}
    />
  );
}

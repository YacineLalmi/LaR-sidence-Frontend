"use client";

import CreateClassificationDialog from "../../../_components/create-classification-dialog";
import { CATEGORIES, SCOPES } from "@/services/classification.service";
import { ListItem } from "@/schemas/global.schema";
import { TRANSLATIONS_KEYS_2 } from "@/i18n/translation-keys";

interface Props {
  colors: ListItem[];
}
export default function CreateOfferStatusDialog({ colors }: Props) {
  return (
    <CreateClassificationDialog
      category={CATEGORIES.STATUS}
      scope={SCOPES.OFFER}
      colors={colors}
      title={TRANSLATIONS_KEYS_2.SETTINGS.OFFERS.STATUSES.FORM.TITLES.CREATE}
      buttonText={TRANSLATIONS_KEYS_2.SETTINGS.OFFERS.STATUSES.FORM.BUTTONS.CREATE}
      errorMessage={TRANSLATIONS_KEYS_2.SETTINGS.OFFERS.STATUSES.FORM.MESSAGES.FAILED_CREATION}
      successMessage={TRANSLATIONS_KEYS_2.SETTINGS.OFFERS.STATUSES.FORM.MESSAGES.CREATED}
    />
  );
}

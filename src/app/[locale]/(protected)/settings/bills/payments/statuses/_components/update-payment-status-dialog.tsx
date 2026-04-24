"use client";

import { CATEGORIES, SCOPES } from "@/services/classification.service";
import { ListItem } from "@/schemas/global.schema";
import { TRANSLATIONS_KEYS_2 } from "@/i18n/translation-keys";
import { Classification } from "@/schemas/classification/classification.schema";
import UpdateClassificationDialog from "../../../../_components/update-classification-dialog";

interface Props {
  classification: Classification;
}
export default function UpdatePaymentStatusDialog({ classification }: Props) {
  return (
    <UpdateClassificationDialog
      title={TRANSLATIONS_KEYS_2.SETTINGS.BILLS.PAYMENTS.STATUSES.FORM.TITLES.UPDATE}
      classification={classification}
      category={CATEGORIES.STATUS}
      scope={SCOPES.PAYMENT}
      errorMessage={TRANSLATIONS_KEYS_2.SETTINGS.BILLS.PAYMENTS.STATUSES.FORM.MESSAGES.FAILED_UPDATE}
      successMessage={TRANSLATIONS_KEYS_2.SETTINGS.BILLS.PAYMENTS.STATUSES.FORM.MESSAGES.UPDATED}
    />
  );
}

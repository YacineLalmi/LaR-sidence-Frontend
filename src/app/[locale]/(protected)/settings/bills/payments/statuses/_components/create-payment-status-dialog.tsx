"use client";

import { CATEGORIES, SCOPES } from "@/services/classification.service";
import { TRANSLATIONS_KEYS_2 } from "@/i18n/translation-keys";
import CreateClassificationDialog from "../../../../_components/create-classification-dialog";

export default function CreatePaymentStatusDialog() {
  return (
    <CreateClassificationDialog
      category={CATEGORIES.STATUS}
      scope={SCOPES.PAYMENT}
      title={TRANSLATIONS_KEYS_2.SETTINGS.BILLS.PAYMENTS.STATUSES.FORM.TITLES.CREATE}
      buttonText={TRANSLATIONS_KEYS_2.SETTINGS.BILLS.PAYMENTS.STATUSES.FORM.BUTTONS.CREATE}
      errorMessage={TRANSLATIONS_KEYS_2.SETTINGS.BILLS.PAYMENTS.STATUSES.FORM.MESSAGES.FAILED_CREATION}
      successMessage={TRANSLATIONS_KEYS_2.SETTINGS.BILLS.PAYMENTS.STATUSES.FORM.MESSAGES.CREATED}
    />
  );
}

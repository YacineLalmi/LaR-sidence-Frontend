"use client";

import { CATEGORIES, SCOPES } from "@/services/classification.service";
import { TRANSLATIONS_KEYS_2 } from "@/i18n/translation-keys";
import CreateClassificationDialog from "../../../../_components/create-classification-dialog";

export default function CreatePaymentMethodDialog() {
  return (
    <CreateClassificationDialog
      category={CATEGORIES.METHOD}
      scope={SCOPES.PAYMENT}
      title={TRANSLATIONS_KEYS_2.SETTINGS.BILLS.PAYMENTS.METHODS.FORM.TITLES.CREATE}
      buttonText={TRANSLATIONS_KEYS_2.SETTINGS.BILLS.PAYMENTS.METHODS.FORM.BUTTONS.CREATE}
      errorMessage={TRANSLATIONS_KEYS_2.SETTINGS.BILLS.PAYMENTS.METHODS.FORM.MESSAGES.FAILED_CREATION}
      successMessage={TRANSLATIONS_KEYS_2.SETTINGS.BILLS.PAYMENTS.METHODS.FORM.MESSAGES.CREATED}
    />
  );
}

"use client";

import { useTranslations } from "next-intl";
import ErrorCard from "@/components/error/error-card";
import ForbiddenImage from "@/assests/images/403.svg";
import NotFoundImage from "@/assests/images/404.svg";
import { ErrorCodes } from "@/constants/error-codes";
import { TRANSLATIONS_KEYS_2 } from "@/i18n/translation-keys";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const t = useTranslations();

  switch (error.name) {
    case ErrorCodes.UNAUTHORIZED:
      return <ErrorCard reset={reset} message={t(TRANSLATIONS_KEYS_2.COMMON.MESSAGES.UNAUTHORIZED)} />;

    case ErrorCodes.FORBIDDEN:
      return (
        <ErrorCard reset={reset} message={t(TRANSLATIONS_KEYS_2.COMMON.MESSAGES.FORBIDDEN)} image={ForbiddenImage} />
      );

    case ErrorCodes.RESOURCE_NOT_FOUND:
      return (
        <ErrorCard reset={reset} message={t(TRANSLATIONS_KEYS_2.COMMON.MESSAGES.NOT_FOUND)} image={NotFoundImage} />
      );

    default:
      return <ErrorCard reset={reset} />;
  }
}

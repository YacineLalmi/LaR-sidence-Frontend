"use client";

import { useTranslations } from "next-intl";
import ErrorCard from "@/components/error/error-card";
import { ErrorCodes } from "@/lib/constants";
import ForbiddenImage from "@/assests/images/403.svg";
import NotFoundImage from "@/assests/images/404.svg";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const t = useTranslations();

  switch (error.name) {
    case ErrorCodes.UNAUTHORIZED:
      return <ErrorCard reset={reset} message={t("common.errors.unauthorized")} />;

    case ErrorCodes.FORBIDDEN:
      return <ErrorCard reset={reset} message={t("common.errors.forbidden")} image={ForbiddenImage} />;

    case ErrorCodes.RESOURCE_NOT_FOUND:
      return <ErrorCard reset={reset} message={t("common.errors.notfound")} image={NotFoundImage} />;

    default:
      return <ErrorCard reset={reset} />;
  }
}

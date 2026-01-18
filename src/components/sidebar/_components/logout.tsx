"use client";
import { logoutAction } from "@/actions/authentication/logout.action";
import { Button } from "@/components/ui/button";
import { TRANSLATIONS_KEYS } from "@/i18n/translation-constants";
import { TRANSLATIONS_KEYS_2 } from "@/i18n/translation-keys";
import { NAVIGATION_KEYS } from "@/lib/navigation-constants";
import { customToast } from "@/lib/utils";
import { Loader, LogOut } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { MouseEvent, useCallback, useState } from "react";

export default function Logout() {
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();
  const translation = useTranslations();

  const handleLogout = useCallback(async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsPending(true);
    const response = await logoutAction();
    try {
      if (response.isOk) {
        router.push(NAVIGATION_KEYS.AUTH.LOGIN);
        customToast.success(translation(TRANSLATIONS_KEYS.COMMON.SUCCESS.OPERATION_COMPLETED));
      } else customToast.error(response.errorMessage || translation(TRANSLATIONS_KEYS.COMMON.ERRORS.SOMETHING_WRONG));
    } catch (error) {
      customToast.error(translation(TRANSLATIONS_KEYS.COMMON.ERRORS.SOMETHING_WRONG));
    } finally {
      setIsPending(false);
    }
  }, []);
  return (
    <Button
      className="flex gap-3 mr-2 hover:bg-accent p-1 px-2 hover:text-primary rounded-lg text-sm w-full justify-start cursor-pointer"
      disabled={isPending}
      onClick={handleLogout}
    >
      {isPending ? <Loader className="animate-spin" /> : <LogOut />}
      <span>Se déconnecter</span>
    </Button>
    // <Link
    //   href="#"
    //   onClick={handleLogout}
    //
    // >
    // </Link>
  );
}

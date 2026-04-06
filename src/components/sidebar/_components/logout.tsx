"use client";
import { logoutAction } from "@/actions/authentication/logout.action";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";
import { TRANSLATIONS_KEYS_2 } from "@/i18n/translation-keys";
import { customToast } from "@/lib/utils";
import { Loader, LogOut } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { MouseEvent, useCallback, useState } from "react";

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
        router.push(ROUTES.AUTH.LOGIN);
        customToast.success(translation(TRANSLATIONS_KEYS_2.COMMON.MESSAGES.OPERATION_COMPLETED));
      } else
        customToast.error(response.errorMessage || translation(TRANSLATIONS_KEYS_2.COMMON.MESSAGES.SOMETHING_WRONG));
    } catch (error) {
      customToast.error(translation(TRANSLATIONS_KEYS_2.COMMON.MESSAGES.SOMETHING_WRONG));
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
  );
}

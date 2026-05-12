"use client";

import Settings from "./components/settings";
import Profile from "./components/profile";
import { User } from "@/schemas/users/user.schema";
import { Card, CardContent } from "@/components/ui/card";
import LanguageSwitcher from "./components/language-switcher";
import NavigationButton from "@/components/ui/navigation-button";
import { useTranslations } from "next-intl";
import { usePathname } from "@/i18n/navigation";
import { ROUTES_CONFIG } from "@/config/route.config";
import { findMatchingRoute } from "@/lib/utiles/route.utile";

type Props = {
  user: User | null;
  locale?: string;
};

export default function NavBar({ user, locale = "fr" }: Props) {
  const isRTL = locale === "ar";
  const translation = useTranslations();
  const path = usePathname();
  const route = findMatchingRoute(path);

  console.log(route);

  return (
    <Card className="mt-4 w-full rounded-none border-none bg-transparent p-0 pb-4 shadow-none sm:pb-6">
      <CardContent className="flex items-center justify-between gap-2 sm:gap-3">
        <div>{route && <NavigationButton title={translation(route.title)} backLink={route.backLink} />}</div>
        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <Settings />
          <Profile user={user} />
        </div>
      </CardContent>
    </Card>
  );
}

import Settings from "./components/settings";
import Profile from "./components/profile";
import LanguageSwitcher from "./components/language-switcher";
import { Card, CardContent } from "@/components/ui/card";

export default function NavBar({ locale = "fr" }: { locale?: string }) {
  const isRTL = locale === "ar";

  return (
    <Card className="rounded-none w-full bg-transparent border-none shadow-none mt-4 p-0">
      <CardContent className={`flex justify-end items-center gap-2`}>
        <LanguageSwitcher />
        <Settings />
        <Profile />
      </CardContent>
    </Card>
  );
}

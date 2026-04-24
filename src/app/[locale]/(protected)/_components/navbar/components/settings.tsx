import { ROUTES } from "@/constants/routes";
import { SettingsIcon } from "lucide-react";
import Link from "next/link";

export default function Settings() {
  return (
    <Link href={ROUTES.SETTINGS.ROOT} aria-label="Paramètres" title="Paramètres">
      <SettingsIcon className="h-5 w-5" strokeWidth={1.75} />
    </Link>
  );
}

import { ROUTES } from "@/constants/routes";
import { Link } from "@/i18n/navigation";
import { SettingsIcon } from "lucide-react";

export default function Settings() {
  return (
    <Link href={ROUTES.SETTINGS.ROOT} aria-label="Paramètres" title="Paramètres">
      <SettingsIcon className="h-5 w-5" strokeWidth={1.75} />
    </Link>
  );
}

import { ROUTES } from "@/constants/routes";
import { SettingsIcon } from "lucide-react";
import Link from "next/link";

export default function Settings() {
  return (
    <Link
      href={ROUTES.SETTINGS.ROOT}
      className="inline-flex shrink-0 rounded-full p-2 text-foreground transition-colors hover:bg-black/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      aria-label="Paramètres"
      title="Paramètres"
    >
      <SettingsIcon className="h-5 w-5" strokeWidth={1.75} />
    </Link>
  );
}

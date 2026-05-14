import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SettingsItem } from "@/types/settings";
import { ExternalLink } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

interface Props {
  module: SettingsItem;
}

export default async function SettingCard({ module }: Props) {
  const translation = await getTranslations();
  return (
    <Card
      key={module.id}
      className="overflow-hidden border-none shadow-sm hover:shadow-md transition-shadow p-0 gap-0 min-h-48"
    >
      <CardHeader className="flex flex-row items-center gap-4 py-4 bg-[#C5A267]">
        <module.icon className="text-white" size={32} />
        <div>
          <CardTitle className="text-xl text-white">{translation(module.title)}</CardTitle>
          <CardDescription className="text-white text-nowrap truncate text-ellipsis max-w-80 overflow-hidden">
            {translation(module.description)}
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="p-0 bg-white h-full">
        <div className="grid grid-cols-1">
          {module.subs.map((sub) => (
            <Link
              href={sub.link}
              key={sub.id}
              className="flex items-center justify-between p-2 text-sm font-medium hover:bg-[#F5F2EB]/50 hover:text-[#C5A267] transition-colors  group"
            >
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-zinc-300 group-hover:bg-[#C5A267]" />
                {translation(sub.title)}
              </div>
              <ExternalLink size={14} className="text-zinc-400 mr-5 transition-transform" />
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

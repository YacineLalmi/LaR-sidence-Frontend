import { Link } from "@/i18n/navigation";
import { Button } from "./button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useLocale } from "next-intl";

interface Props {
  title: string;
  backLink?: string | undefined;
  backTitle?: string | undefined;
}

export default function NavigationButton({ title, backLink, backTitle }: Props) {
  const isRTL = useLocale() === "ar";
  return (
    <div className="flex gap-3 items-center">
      {backLink && (
        <Link href={backLink}>
          <Button className="cursor-pointer rounded-full" title={backTitle}>
            {isRTL ? <ArrowRight /> : <ArrowLeft />}
          </Button>
        </Link>
      )}
      <h1 className="text-xl font-bold">{title}</h1>
    </div>
  );
}

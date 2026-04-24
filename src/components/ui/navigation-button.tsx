import Link from "next/link";
import { Button } from "./button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useLocale } from "next-intl";

interface Props {
  title: string;
  backLink?: string | undefined;
  backTitle?: string | undefined;
}

export default function NavigationButton({ title, backLink = "/dashboard", backTitle = "Dashboard" }: Props) {
  const isRTL = useLocale() === "ar";
  return (
    <div className="flex gap-3 items-center">
      <Link href={backLink}>
        <Button className="cursor-pointer rounded-full">{isRTL ? <ArrowRight /> : <ArrowLeft />}</Button>
      </Link>
      <h1 className="text-xl font-bold">{title}</h1>
    </div>
  );
}

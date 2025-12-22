import SearchField from "@/components/ui/search";
import React, { use } from "react";
import BienFilter from "./BienFilter";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";

export default function BienHeader() {
  const t = useTranslations("biens");
  return (
    <>
      <div className="flex items-center gap-2 justify-between w-full p-0">
        <div className="flex w-full gap-2">
          <SearchField />
          <BienFilter />
        </div>
        <Link href="/biens/add">
          <Button className="cursor-pointer p-6 rounded-4xl flex gap-1 hover:bg-amber-200 hover:text-black hover:border-gray-600 border-1">
            <Plus />
            {t("create.buttonText")}
          </Button>
        </Link>
      </div>
    </>
  );
}

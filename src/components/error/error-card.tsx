import React from "react";
import { Card, CardContent, CardFooter } from "../ui/card";
import Image from "next/image";
import { Button } from "../ui/button";
import { RefreshCcw } from "lucide-react";
import { useTranslations } from "next-intl";
import errorImage from "@/assests/images/Error.svg";
import { TRANSLATIONS_KEYS_2 } from "@/i18n/translation-keys";

export default function ErrorCard({
  reset,
  image = errorImage,
  message,
}: {
  reset: () => void;
  image?: any;
  message?: string;
}) {
  const t = useTranslations();
  return (
    <Card className="flex h-full w-full items-center justify-center">
      <CardContent>
        <Image src={image} alt="eefs" width={350} />
      </CardContent>
      <h2 className="font-bold text-2xl">{t(TRANSLATIONS_KEYS_2.COMMON.MESSAGES.SOMETHING_WRONG)}</h2>
      <span>{message || t(TRANSLATIONS_KEYS_2.COMMON.MESSAGES.UNKNOWN)}</span>
      <CardFooter>
        <Button className=" p-5 cursor-pointer" onClick={() => reset()}>
          <RefreshCcw />
          {t(TRANSLATIONS_KEYS_2.COMMON.MESSAGES.UNKNOWN)}
        </Button>
      </CardFooter>
    </Card>
  );
}

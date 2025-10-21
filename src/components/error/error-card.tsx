import React from "react";
import { Card, CardContent, CardFooter } from "../ui/card";
import Image from "next/image";
import { Button } from "../ui/button";
import { RefreshCcw } from "lucide-react";
import { useTranslations } from "next-intl";
import errorImage from "@/assests/images/Error.svg";

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
      <h2 className="font-bold text-2xl">{t("common.errors.somethingwrong")}</h2>
      <span>{message || t("common.errors.unknown")}</span>
      <CardFooter>
        <Button className=" p-5 cursor-pointer" onClick={() => reset()}>
          <RefreshCcw />
          {t("common.errors.unknown")}
        </Button>
      </CardFooter>
    </Card>
  );
}

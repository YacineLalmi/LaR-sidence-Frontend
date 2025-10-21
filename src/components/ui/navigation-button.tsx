import Link from "next/link";
import React from "react";
import { Button } from "./button";
import { ArrowLeft } from "lucide-react";

interface Props {
  title: string;
  backLink?: string | undefined;
  backTitle?: string | undefined;
}

export default function NavigationButton({ title, backLink = "/dashboard", backTitle = "Dashboard" }: Props) {
  return (
    <div className="flex gap-3 items-center">
      <Link href={backLink}>
        <Button className="cursor-pointer rounded-full">
          <ArrowLeft />
        </Button>
      </Link>
      <h1 className="text-2xl font-bold">{title}</h1>
    </div>
  );
}

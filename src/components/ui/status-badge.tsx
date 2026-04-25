"use client";

import { Classification } from "@/schemas/classification/classification.schema";
import { useLocale } from "next-intl";

interface Props {
  status: Classification | undefined | null;
}
export const StatusBadge = ({ status }: Props) => {
  const locale = useLocale() as "fr" | "en" | "ar";
  if (!status) return;
  return (
    <div
      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full w-24`}
      title={status.name[locale]}
      style={{ backgroundColor: status.color?.background_color || "black" }}
    >
      <div className={`size-2 rounded-full w-2.5`} style={{ backgroundColor: status.color?.text_color || "white" }} />
      <span
        className={`text-xs font-medium overflow-hidden text-ellipsis w-full`}
        style={{ color: status.color?.text_color || "white" }}
      >
        {status.name[locale]}
      </span>
    </div>
  );
};

import { BienStatus } from "@/schemas/bien-status/bien-status.schema";
import React from "react";

interface Props {
  status: BienStatus;
}
export const StatusBadge = ({ status }: Props) => {
  return (
    <div
      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full w-24`}
      title={status.name}
      style={{ backgroundColor: status.color.background_color }}
    >
      <div className={`size-2 rounded-full w-2.5`} style={{ backgroundColor: status.color.text_color }} />
      <span className={`text-xs font-medium overflow-hidden text-ellipsis w-full`} style={{ color: status.color.text_color }}>
        {status.name}
      </span>
    </div>
  );
};

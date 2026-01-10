import { BienStatus } from "@/schemas/bien-status/bien-status.schema";
import React from "react";

interface Props {
  status: BienStatus;
}
export const StatusBadge = ({ status }: Props) => {
  return (
    <div
      className={`inline-flex items-center gap-2 px-2 py-1 rounded-full`}
      style={{ backgroundColor: status.color.background_color }}
    >
      <div className={`w-2 h-2 rounded-full`} style={{ backgroundColor: status.color.text_color }} />
      <span className={`text-sm font-medium`} style={{ color: status.color.text_color }}>
        {status.name}
      </span>
    </div>
  );
};

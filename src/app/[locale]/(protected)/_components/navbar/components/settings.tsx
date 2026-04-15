import { SettingsIcon } from "lucide-react";
import React from "react";

export default function Settings() {
  return (
    <div className="flex justify-center items-center cursor-pointer border-1 rounded-full p-1">
      <SettingsIcon className="size-6" />
    </div>
  );
}

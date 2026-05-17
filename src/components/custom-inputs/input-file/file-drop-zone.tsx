"use client";

import { Images } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { TRANSLATIONS_KEYS_2 } from "@/i18n/translation-keys";
import { AcceptableFileTypes } from ".";

interface FileDropzoneProps {
  multiple: boolean;
  accept: AcceptableFileTypes[];
  maxFileSize?: number;
  maxFiles?: number;
  disabled: boolean;
  onClick: () => void;
}

const FORMAT_MAP: Record<string, string> = {
  "image/jpg": "JPG",
  "image/jpeg": "JPEG",
  "image/png": "PNG",
  "image/webp": "WEBP",
  "application/pdf": "PDF",
  "application/msword": "DOC",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "DOCX",
};

export default function FileDropZone({
  multiple,
  accept,
  maxFileSize,
  maxFiles,
  disabled,
  onClick,
}: FileDropzoneProps) {
  const translation = useTranslations();
  return (
    <div onClick={() => !disabled && onClick()} className={cn(disabled ? "cursor-not-allowed" : "cursor-pointer")}>
      <Images className="w-16 h-16 mx-auto mb-4 text-black" />
      <p className="text-gray-600 mb-2">
        {multiple
          ? translation(TRANSLATIONS_KEYS_2.COMMON.INPUTS.PLACEHOLDERS.FILES)
          : translation(TRANSLATIONS_KEYS_2.COMMON.INPUTS.PLACEHOLDERS.FILE)}
      </p>
      <div className="flex flex-col text-gray-400 text-xs font-light">
        <span>
          {accept &&
            translation(TRANSLATIONS_KEYS_2.COMMON.MESSAGES.ACCEPTED_FORMAT, {
              formats: accept.map((a) => FORMAT_MAP[a] || a.replace(/\./g, "").toUpperCase()).join(", "),
            })}
        </span>
        <span>{maxFileSize && translation(TRANSLATIONS_KEYS_2.COMMON.MESSAGES.MAX_SIZE, { size: maxFileSize })}</span>
        <span>{maxFiles && translation(TRANSLATIONS_KEYS_2.COMMON.MESSAGES.MAX_FILES, { count: maxFiles })}</span>
      </div>
    </div>
  );
}

"use client";
import { Images } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileDropzoneProps {
  multiple: boolean;
  accept: string;
  maxFileSize: number;
  maxFiles?: number;
  disabled: boolean;
  onClick: () => void;
}

export default function FileDropZone({
  multiple,
  accept,
  maxFileSize,
  maxFiles,
  disabled,
  onClick,
}: FileDropzoneProps) {
  return (
    <div onClick={() => !disabled && onClick()} className={cn(disabled ? "cursor-not-allowed" : "cursor-pointer")}>
      <Images className="w-16 h-16 mx-auto mb-4 text-black" />
      <p className="text-gray-600 mb-2">
        {multiple
          ? "Glissez-déposez vos fichiers ici ou cliquez pour importer"
          : "Glissez-déposez votre fichier ici ou cliquez pour importer"}
      </p>
      <p className="text-sm text-gray-400">
        {accept && `Formats acceptés: ${accept.replace(/\./g, "").toUpperCase()}`}
        {maxFileSize && ` (max ${maxFileSize}MB)`}
        {maxFiles && ` - Maximum ${maxFiles} fichier${maxFiles > 1 ? "s" : ""}`}
      </p>
    </div>
  );
}

"use client";
import { X } from "lucide-react";
import FileIcon from "./file-icon";
import { Media } from "@/schemas/global/media.schema";

export type FileOrDocument = File | Media;

interface FileCardProps {
  file: FileOrDocument;
  index: number;
  onRemove: (index: number) => void;
  disabled?: boolean;
  showFilename?: boolean;
}

export default function FileCard({ file, index, onRemove, disabled = false, showFilename = false }: FileCardProps) {
  const isFileObject = file instanceof File;
  const fileName = isFileObject ? file.name : file.file_name;

  return (
    <div className="relative group">
      <div className="aspect-square rounded-lg overflow-hidden bg-white border border-gray-200 flex items-center justify-center">
        <div className="flex flex-col items-center justify-center p-2 w-full h-full">
          <FileIcon file={file} />
        </div>
      </div>

      {!disabled && (
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onRemove(index);
          }}
          className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-600 z-10"
          aria-label={`Remove ${fileName}`}
        >
          <X className="w-3 h-3" />
        </button>
      )}
    </div>
  );
}

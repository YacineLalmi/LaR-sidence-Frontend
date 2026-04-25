"use client";
import { FileText, File } from "lucide-react";

interface FileIconProps {
  file: File;
  className?: string;
}

export default function FileIcon({ file, className = "" }: FileIconProps) {
  if (file.type.startsWith("image/")) {
    return (
      <img src={URL.createObjectURL(file)} alt={file.name} className={`w-full h-full object-cover ${className}`} />
    );
  }

  if (file.type.includes("pdf") || file.type.includes("document")) {
    return (
      <div className="flex flex-col items-center justify-center gap-1">
        <FileText className="w-6 h-6 text-blue-500" />
        <span className="text-xs text-center truncate max-w-full">{file.name}</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center gap-1">
      <File className="w-6 h-6 text-gray-500" />
      <span className="text-xs text-center truncate max-w-full">{file.name}</span>
    </div>
  );
}

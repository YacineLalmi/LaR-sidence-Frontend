"use client";
import { FileText, File as FileIconLucide } from "lucide-react";
import { useEffect, useState } from "react";

interface FileIconProps {
  file: File;
  className?: string;
}

export default function FileIcon({ file, className = "" }: FileIconProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);

  const mimeType = file.type;
  const fileName = file.name;

  useEffect(() => {
    if (mimeType.startsWith("image/")) {
      // For File objects, create blob URL
      const url = URL.createObjectURL(file as File);
      setPreviewUrl(url);

      // Cleanup function to revoke the object URL
      return () => {
        URL.revokeObjectURL(url);
      };
    }
  }, [file, mimeType]);

  // Display image preview
  if (mimeType.startsWith("image/")) {
    return (
      <div className="flex flex-col items-center gap-1 w-full h-full">
        {previewUrl && !imageError ? (
          <img
            src={previewUrl}
            alt={fileName}
            className={`w-full h-24 object-cover rounded ${className}`}
            onError={(e) => {
              setImageError(true);
            }}
          />
        ) : (
          <div className="w-full h-24 bg-gray-100 rounded flex items-center justify-center">
            <FileIconLucide className="w-8 h-8 text-gray-400" />
          </div>
        )}
        <span className="text-[10px] text-center truncate max-w-full px-1 leading-tight">{fileName}</span>
      </div>
    );
  }

  // Display PDF icon (red)
  if (mimeType.includes("pdf")) {
    return (
      <div className="flex flex-col items-center justify-center gap-1 p-2">
        <FileText className="w-10 h-10 text-red-500" />
        <span className="text-[10px] text-center truncate max-w-full px-1 leading-tight">{fileName}</span>
      </div>
    );
  }

  // Display DOC/DOCX icon (blue)
  if (mimeType.includes("document") || mimeType.includes("msword")) {
    return (
      <div className="flex flex-col items-center justify-center gap-1 p-2">
        <FileText className="w-10 h-10 text-blue-500" />
        <span className="text-[10px] text-center truncate max-w-full px-1 leading-tight">{fileName}</span>
      </div>
    );
  }

  // Default file icon
  return (
    <div className="flex flex-col items-center justify-center gap-1 p-2">
      <FileIconLucide className="w-10 h-10 text-gray-500" />
      <span className="text-[10px] text-center truncate max-w-full px-1 leading-tight">{fileName}</span>
    </div>
  );
}

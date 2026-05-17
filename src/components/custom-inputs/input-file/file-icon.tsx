"use client";
import { Media } from "@/schemas/global/media.schema";
import { FileText, File as Fileicon } from "lucide-react";
import { useEffect, useState } from "react";

interface FileIconProps {
  file: File | Media;
  className?: string;
}

export default function FileIcon({ file, className = "" }: FileIconProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Check if it's a File object or a document object from API
  const isFileObject = file instanceof File;
  const mimeType = isFileObject ? file.type : file.mime_type;
  const fileName = isFileObject ? file.name : file.file_name || file.name;

  useEffect(() => {
    if (isFileObject && mimeType.startsWith("image/")) {
      // For File objects, create blob URL
      const url = URL.createObjectURL(file as File);
      setPreviewUrl(url);

      // Cleanup function to revoke the object URL
      return () => {
        URL.revokeObjectURL(url);
      };
    }
    // else if (!isFileObject && mimeType.startsWith("image/") && file.url) {
    //   // For API documents, use the provided URL directly
    //   setPreviewUrl(file.url);
    // }
  }, [file, isFileObject, mimeType]);

  // Display image preview
  if (mimeType.startsWith("image/")) {
    return (
      <div className="flex flex-col items-center gap-1 w-full">
        {previewUrl ? (
          <img
            src={previewUrl}
            alt={fileName}
            className={`w-full h-24 object-cover rounded ${className}`}
            onError={(e) => {
              console.error("Image failed to load:", previewUrl);
              // Fallback to file icon on error
              e.currentTarget.style.display = "none";
            }}
          />
        ) : (
          <div className="w-full h-24 bg-gray-100 rounded flex items-center justify-center">
            <Fileicon className="w-8 h-8 text-gray-400" />
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
      <Fileicon className="w-10 h-10 text-gray-500" />
      <span className="text-[10px] text-center truncate max-w-full px-1 leading-tight">{fileName}</span>
    </div>
  );
}

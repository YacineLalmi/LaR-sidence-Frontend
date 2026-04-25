"use client";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import FileCard from "./file-card";
import { Button } from "@/components/ui/button";

interface FilesGridProps {
  files: File[];
  multiple: boolean;
  disabled: boolean;
  maxFiles?: number;
  onRemove: (index: number) => void;
  onAddMore: () => void;
  onShowModal: () => void;
}

export default function FilesGrid({
  files,
  multiple,
  disabled,
  maxFiles,
  onRemove,
  onAddMore,
  onShowModal,
}: FilesGridProps) {
  const displayedFiles = files.slice(0, multiple ? 2 : 1);
  const hasMoreFiles = multiple && files.length > 2;
  const canAddMore = multiple && !disabled && (!maxFiles || files.length < maxFiles);

  return (
    <div className={cn("grid gap-3", multiple ? "grid-cols-4" : "grid-cols-1 max-w-xs mx-auto")}>
      {/* Display files */}
      {displayedFiles.map((file, index) => (
        <FileCard
          key={index}
          file={file}
          index={index}
          onRemove={onRemove}
          disabled={disabled}
          showFilename={!multiple}
        />
      ))}

      {/* Show more button for multiple files */}
      {hasMoreFiles && (
        <div
          onClick={onShowModal}
          className="aspect-square rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 hover:bg-gray-100 transition-colors"
        >
          <span className="text-2xl font-semibold text-gray-600">+{files.length - 2}</span>
          <span className="text-xs text-gray-500 mt-1">Voir plus</span>
        </div>
      )}

      {/* Add more button (only for multiple mode) */}
      {canAddMore && (
        <div
          onClick={onAddMore}
          className="aspect-square rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:border-gray-400 hover:bg-gray-100 transition-colors"
        >
          <Plus className="w-8 h-8 text-gray-400" />
        </div>
      )}

      {/* Replace button (for single mode when file exists) */}
      {!multiple && !disabled && (
        <Button type="button" onClick={onAddMore} className="mt-2" variant="outline">
          Remplacer le fichier
        </Button>
      )}
    </div>
  );
}

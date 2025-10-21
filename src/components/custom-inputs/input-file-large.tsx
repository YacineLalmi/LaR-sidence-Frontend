"use client";

import type React from "react";

import { useState, useCallback } from "react";
import { ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function InputFileLarge() {
  const [isDragOver, setIsDragOver] = useState(false);
  const [files, setFiles] = useState<File[]>([]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const droppedFiles = Array.from(e.dataTransfer.files).filter(
      (file) => file.type.startsWith("image/") && file.size <= 500 * 1024 // 500KB limit
    );

    setFiles((prev) => [...prev, ...droppedFiles]);
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files).filter(
        (file) => file.type.startsWith("image/") && file.size <= 500 * 1024 // 500KB limit
      );
      setFiles((prev) => [...prev, ...selectedFiles]);
    }
  }, []);

  const handleClick = () => {
    document.getElementById("file-input")?.click();
  };

  return (
    <div className="w-full">
      <div
        className={cn(
          "relative border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors",
          "hover:border-muted-foreground/50 hover:bg-muted/20",
          isDragOver ? "border-primary bg-primary/5" : "border-muted-foreground/30 bg-muted/10"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input
          id="file-input"
          type="file"
          multiple
          accept="image/jpeg,image/jpg,image/png"
          onChange={handleFileSelect}
          className="hidden"
        />

        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-2 border-muted-foreground/40 rounded-lg flex items-center justify-center">
            <ImageIcon className="w-8 h-8 text-muted-foreground" />
          </div>

          <div className="space-y-2">
            <p className="text-foreground font-medium">Glissez-déposez vos images ici ou cliquez pour importer</p>
            <p className="text-sm text-muted-foreground">
              Formats : JPG, JPEG, PNG — max 500Ko / image, format carré (1:1) recommandé
            </p>
          </div>
        </div>
      </div>

      {files.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-medium mb-3">Images sélectionnées :</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {files.map((file, index) => (
              <div key={index} className="relative">
                <img
                  src={URL.createObjectURL(file) || "/placeholder.svg"}
                  alt={`Upload ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg border"
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setFiles((prev) => prev.filter((_, i) => i !== index));
                  }}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center text-sm hover:bg-destructive/80"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

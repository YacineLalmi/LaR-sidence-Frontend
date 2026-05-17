"use client";
import { useState, useRef, useEffect } from "react";
import { Control, FieldPath, FieldValues } from "react-hook-form";
import { cn } from "@/lib/utils";
import { useFileValidation } from "./use-file-validation";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import LoadingOverlay from "./loading-overlay";
import FileDropZone from "./file-drop-zone";
import FilesGrid from "./files-grid";
import { Input } from "@/components/ui/input";
import FilesModal from "./files-modal";
import { FileOrDocument } from "./file-card";

export type AcceptableFileTypes =
  | "image/jpg"
  | "image/jpeg"
  | "image/png"
  | "image/webp"
  | "application/pdf"
  | "application/msword"
  | "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

type InputFieldProps<T extends FieldValues> = {
  control: Control<T>;
  name: FieldPath<T>;
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  areFileLoading?: boolean;
  multiple?: boolean;
  accept?: AcceptableFileTypes[];
  maxFiles?: number;
  maxFileSize?: number;
  existingDocuments?: FileOrDocument[];
  onDocumentDelete?: (documentId: string) => void;
};

export default function InputFileLarge<T extends FieldValues>({
  control,
  name,
  label,
  required = false,
  disabled = false,
  areFileLoading = false,
  multiple = true,
  accept = ["image/jpg", "image/jpeg", "image/png", "application/pdf"],
  maxFiles,
  maxFileSize,
  existingDocuments = [],
  onDocumentDelete,
}: InputFieldProps<T>) {
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [displayedDocuments, setDisplayedDocuments] = useState<FileOrDocument[]>(existingDocuments);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const { error, validateFiles, clearError } = useFileValidation({
    maxFileSize,
    maxFiles,
  });

  // Update displayed documents when existingDocuments prop changes
  useEffect(() => {
    setDisplayedDocuments(existingDocuments);
  }, [existingDocuments]);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        const newFiles = multiple ? (field.value as File[]) || [] : field.value ? [field.value as File] : [];

        // Combine existing documents with new files for display
        const allFiles: FileOrDocument[] = [...displayedDocuments, ...newFiles];

        const handleFilesChange = (newFiles: File[]) => {
          if (multiple) {
            field.onChange(newFiles);
          } else {
            field.onChange(newFiles[0] || null);
          }
        };

        const removeFile = (index: number) => {
          // Check if it's an existing document or a new file
          if (index < displayedDocuments.length) {
            // It's an existing document
            const documentToRemove = displayedDocuments[index];

            // Remove from displayed documents
            const updatedDisplayedDocs = displayedDocuments.filter((_, i) => i !== index);
            setDisplayedDocuments(updatedDisplayedDocs);

            // Call the delete callback if provided
            if (onDocumentDelete && "id" in documentToRemove) {
              onDocumentDelete(documentToRemove.id);
            }
          } else {
            // It's a new file
            const newFileIndex = index - displayedDocuments.length;
            const updatedFiles = newFiles.filter((_, i) => i !== newFileIndex);
            handleFilesChange(updatedFiles);
          }

          clearError();
        };

        const addFiles = (newFilesToAdd: File[]) => {
          setIsLoading(true);

          // const validation = validateFiles(newFilesToAdd, [...displayedDocuments, ...newFiles]);
          // if (!validation.valid) {
          //   setIsLoading(false);
          //   return;
          // }

          if (!multiple) {
            // In single mode, clear existing and set new file
            setDisplayedDocuments([]);
            handleFilesChange([newFilesToAdd[0]]);
          } else {
            // In multiple mode, append to existing files
            handleFilesChange([...newFiles, ...newFilesToAdd]);
          }

          setIsLoading(false);
        };

        const handleFileInputClick = () => {
          fileInputRef.current?.click();
        };

        return (
          <FormItem>
            {!!label && (
              <FormLabel className="text-xs md:text-sm lg:text-base">
                {label} <span className={cn("text-[16px]", required ? "text-red-500" : "text-transparent")}>*</span>
              </FormLabel>
            )}

            <FormControl>
              <div className="w-full max-w-4xl mx-auto">
                <div
                  className={cn(
                    "border-2 border-dashed border-black rounded-lg p-8 text-center transition-colors bg-transparent min-h-[200px] relative",
                    disabled ? "opacity-50 cursor-not-allowed" : "hover:border-gray-400 cursor-pointer",
                  )}
                >
                  <LoadingOverlay isLoading={areFileLoading || isLoading} />

                  {allFiles.length === 0 ? (
                    <FileDropZone
                      multiple={multiple}
                      accept={accept}
                      maxFileSize={maxFileSize}
                      maxFiles={maxFiles}
                      disabled={disabled}
                      onClick={handleFileInputClick}
                    />
                  ) : (
                    <FilesGrid
                      files={allFiles}
                      multiple={multiple}
                      disabled={disabled}
                      maxFiles={maxFiles}
                      onRemove={removeFile}
                      onAddMore={handleFileInputClick}
                      onShowModal={() => setShowModal(true)}
                    />
                  )}

                  <Input
                    ref={fileInputRef}
                    type="file"
                    multiple={multiple}
                    accept={accept.join(",")}
                    disabled={disabled}
                    onChange={(e) => {
                      const newFilesToAdd = Array.from(e.target.files ?? []);
                      if (newFilesToAdd.length > 0) {
                        addFiles(newFilesToAdd);
                        e.target.value = "";
                      }
                    }}
                    className="hidden"
                  />
                </div>

                {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
                <FormMessage />

                {multiple && (
                  <FilesModal
                    files={allFiles}
                    isOpen={showModal}
                    disabled={disabled}
                    onClose={() => setShowModal(false)}
                    onRemove={removeFile}
                  />
                )}
              </div>
            </FormControl>
          </FormItem>
        );
      }}
    />
  );
}

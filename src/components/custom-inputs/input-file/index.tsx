"use client";
import { useState, useRef } from "react";
import { Control, FieldPath, FieldValues } from "react-hook-form";
import { cn } from "@/lib/utils";
import { useFileValidation } from "./use-file-validation";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import LoadingOverlay from "./loading-overlay";
import FileDropZone from "./file-drop-zone";
import FilesGrid from "./files-grid";
import { Input } from "@/components/ui/input";
import FilesModal from "./files-modal";

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
  accept?: string;
  maxFiles?: number;
  maxFileSize?: number;
};

export default function InputFileLarge<T extends FieldValues>({
  control,
  name,
  label,
  required = false,
  disabled = false,
  areFileLoading = false,
  multiple = true,
  accept = ".jpg,.jpeg,.png,.pdf",
  maxFiles,
  maxFileSize = 50,
}: InputFieldProps<T>) {
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const { error, validateFiles, clearError } = useFileValidation({
    maxFileSize,
    maxFiles,
  });

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        const files = multiple ? (field.value as File[]) || [] : field.value ? [field.value as File] : [];

        const handleFilesChange = (newFiles: File[]) => {
          if (multiple) {
            field.onChange(newFiles);
          } else {
            field.onChange(newFiles[0] || null);
          }
        };

        const removeFile = (index: number) => {
          const updatedFiles = files.filter((_, i) => i !== index);
          handleFilesChange(updatedFiles);
          clearError();
        };

        const addFiles = (newFiles: File[]) => {
          setIsLoading(true);

          const validation = validateFiles(newFiles, files);
          if (!validation.valid) {
            setIsLoading(false);
            return;
          }

          if (!multiple) {
            handleFilesChange([newFiles[0]]);
          } else {
            handleFilesChange([...files, ...newFiles]);
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

                  {files.length === 0 ? (
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
                      files={files}
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
                    accept={accept}
                    disabled={disabled}
                    onChange={(e) => {
                      const newFiles = Array.from(e.target.files ?? []);
                      if (newFiles.length > 0) {
                        addFiles(newFiles);
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
                    files={files}
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

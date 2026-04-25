"use client";
import { useState, useRef } from "react";
import { X, FileText, File, Plus, Images, Loader2 } from "lucide-react";
import { Control, FieldPath, FieldValues } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

type InputFieldProps<T extends FieldValues> = {
  control: Control<T>;
  name: FieldPath<T>;
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  areFileLoading?: boolean;
  multiple?: boolean; // New prop to enable/disable multiple files
  accept?: string; // File types to accept
  maxFiles?: number; // Maximum number of files allowed
  maxFileSize?: number; // Maximum file size in MB
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
  maxFileSize = 50, // Default 50MB
}: InputFieldProps<T>) {
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const getFileIcon = (file: File) => {
    if (file.type.startsWith("image/"))
      return <img src={URL.createObjectURL(file)} alt={file.name} className="w-full h-full object-cover" />;
    if (file.type.includes("pdf") || file.type.includes("document"))
      return (
        <>
          <FileText className="w-6 h-6 text-blue-500" />
          <span>{file.name}</span>
        </>
      );
    return (
      <>
        <File className="w-6 h-6 text-gray-500" />
        <span>{file.name}</span>
      </>
    );
  };

  const validateFiles = (newFiles: File[], currentFiles: File[]): { valid: boolean; error?: string } => {
    // Check file size
    for (const file of newFiles) {
      if (file.size > maxFileSize * 1024 * 1024) {
        return {
          valid: false,
          error: `Le fichier "${file.name}" dépasse la taille maximale de ${maxFileSize}MB`,
        };
      }
    }

    // Check max files limit
    if (maxFiles && currentFiles.length + newFiles.length > maxFiles) {
      return {
        valid: false,
        error: `Vous ne pouvez télécharger que ${maxFiles} fichier${maxFiles > 1 ? "s" : ""} maximum`,
      };
    }

    return { valid: true };
  };

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        // Handle both single file (File) and multiple files (File[])
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
          setError(null);
        };

        const addFiles = (newFiles: File[]) => {
          setIsLoading(true);
          setError(null);

          // Validate files
          const validation = validateFiles(newFiles, files);
          if (!validation.valid) {
            setError(validation.error || "Erreur de validation");
            setIsLoading(false);
            return;
          }

          // For single file mode, replace existing file
          if (!multiple) {
            handleFilesChange([newFiles[0]]);
          } else {
            handleFilesChange([...files, ...newFiles]);
          }

          setIsLoading(false);
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
                  {(areFileLoading || isLoading) && (
                    <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center z-10 rounded-lg">
                      <div className="flex flex-col items-center gap-3">
                        <Loader2 className="w-10 h-10 text-black animate-spin" />
                        <p className="text-sm text-gray-600 font-medium">Chargement des fichiers...</p>
                      </div>
                    </div>
                  )}

                  {files.length === 0 ? (
                    <div
                      onClick={() => !disabled && fileInputRef.current?.click()}
                      className={disabled ? "cursor-not-allowed" : "cursor-pointer"}
                    >
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
                  ) : (
                    <div className={cn("grid gap-3", multiple ? "grid-cols-4" : "grid-cols-1 max-w-xs mx-auto")}>
                      {/* Display files */}
                      {files.slice(0, multiple ? 2 : 1).map((file, index) => (
                        <div key={index} className="relative group">
                          <div className="aspect-square rounded-lg overflow-hidden bg-white border border-gray-200 flex items-center justify-center">
                            <div className="flex flex-col items-center justify-center p-2">{getFileIcon(file)}</div>
                          </div>
                          {!disabled && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                removeFile(index);
                              }}
                              className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-600"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          )}
                          {!multiple && <p className="text-xs text-gray-600 mt-2 truncate text-center">{file.name}</p>}
                        </div>
                      ))}

                      {/* Show more button for multiple files */}
                      {multiple && files.length > 2 && (
                        <div
                          onClick={() => setShowModal(true)}
                          className="aspect-square rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 hover:bg-gray-100 transition-colors"
                        >
                          <span className="text-2xl font-semibold text-gray-600">+{files.length - 2}</span>
                          <span className="text-xs text-gray-500 mt-1">Voir plus</span>
                        </div>
                      )}

                      {/* Add more button (only for multiple mode) */}
                      {multiple && !disabled && (!maxFiles || files.length < maxFiles) && (
                        <div
                          onClick={() => fileInputRef.current?.click()}
                          className="aspect-square rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:border-gray-400 hover:bg-gray-100 transition-colors"
                        >
                          <Plus className="w-8 h-8 text-gray-400" />
                        </div>
                      )}

                      {/* Replace button (for single mode when file exists) */}
                      {!multiple && !disabled && (
                        <Button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="mt-2"
                          variant="outline"
                        >
                          Remplacer le fichier
                        </Button>
                      )}
                    </div>
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

                {/* Error message */}
                {error && <p className="text-sm text-red-500 mt-2">{error}</p>}

                {/* Form validation message */}
                <FormMessage />

                {/* Modal for viewing all files (only in multiple mode) */}
                {multiple && showModal && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-4xl w-full max-h-[80vh] overflow-hidden flex flex-col">
                      <div className="flex items-center justify-between p-6 border-b">
                        <h2 className="text-xl font-semibold text-gray-800">Tous les fichiers ({files.length})</h2>
                        <Button
                          type="button"
                          onClick={() => setShowModal(false)}
                          variant="ghost"
                          className="text-gray-500 hover:text-gray-700 transition-colors"
                        >
                          <X className="w-6 h-6" />
                        </Button>
                      </div>
                      <div className="p-6 overflow-y-auto">
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
                          {files.map((fileData, index) => (
                            <div key={index} className="relative group">
                              <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 border border-gray-200 flex items-center justify-center">
                                <div className="flex flex-col items-center justify-center p-2">
                                  {getFileIcon(fileData)}
                                </div>
                              </div>
                              {!disabled && (
                                <Button
                                  type="button"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    removeFile(index);
                                  }}
                                  variant="destructive"
                                  className="absolute -top-2 -right-2 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              )}
                              <p className="text-xs text-gray-600 mt-1 truncate text-center">{fileData.name}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </FormControl>
          </FormItem>
        );
      }}
    />
  );
}

"use client";
import { useState, useRef, useEffect } from "react";
import { X, FileText, File, Plus, Images, Loader2 } from "lucide-react";
import { Control, FieldPath, FieldValues, UseFormReturn } from "react-hook-form";
import { FormControl, FormField, FormItem } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

type InputFieldProps<T extends FieldValues> = {
  control: Control<T>;
  name: FieldPath<T>;
  form?: UseFormReturn<any>;
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  areFileLoading?: boolean;
};

export default function InputFileLarge2<T extends FieldValues>({
  control,
  name,
  form,
  areFileLoading = false,
}: InputFieldProps<T>) {
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const getFileIcon = (file: File) => {
    if (file.type.startsWith("image/"))
      return <img src={URL.createObjectURL(file)} alt={file.name} className="w-full h-full object-cover" />;
    if (file.type.includes("pdf") || file.type.includes("document"))
      return <FileText className="w-6 h-6 text-blue-500" />;
    return <File className="w-6 h-6 text-gray-500" />;
  };

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        const files = (field.value as File[]) || [];

        const handleFilesChange = (newFiles: File[]) => {
          field.onChange(newFiles);
        };
        const removeFile = (index: number) => {
          const updatedFiles = files.filter((_, i) => i !== index);
          handleFilesChange(updatedFiles);
        };

        const addFiles = (newFiles: File[]) => {
          setIsLoading(true);
          // Simulate file processing/loading time
          setTimeout(() => {
            handleFilesChange([...files, ...newFiles]);
            setIsLoading(false);
          }, 500);
        };

        return (
          <FormItem>
            <FormControl>
              <div className="w-full max-w-4xl mx-auto">
                <div className="border-2 border-dashed border-black rounded-lg p-8 text-center hover:border-gray-400 transition-colors bg-transparent min-h-[200px] relative">
                  {areFileLoading && (
                    <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center z-10 rounded-lg">
                      <div className="flex flex-col items-center gap-3">
                        <Loader2 className="w-10 h-10 text-black animate-spin" />
                        <p className="text-sm text-gray-600 font-medium">Chargement des fichiers...</p>
                      </div>
                    </div>
                  )}
                  {files.length === 0 ? (
                    <div onClick={() => fileInputRef.current?.click()} className="cursor-pointer">
                      <p className="text-gray-600 mb-2">Glissez-déposez vos images ici ou cliquez pour importer</p>
                      <Images className="w-16 h-16 mx-auto mb-4 text-black" />
                      <p className="text-sm text-gray-400">
                        Formats: JPG, JPEG, PNG, ... (max 50Mo / image, format carré (1:1) recommandé)
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-4 gap-3">
                      {files.slice(0, 2).map((file, index) => (
                        <div key={index} className="relative group">
                          <div className="aspect-square rounded-lg overflow-hidden bg-white border border-gray-200 flex items-center justify-center">
                            <div className="flex flex-col items-center justify-center p-2">{getFileIcon(file)}</div>
                          </div>
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
                        </div>
                      ))}

                      {files.length > 2 && (
                        <div
                          onClick={() => setShowModal(true)}
                          className="aspect-square rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 hover:bg-gray-100 transition-colors"
                        >
                          <span className="text-2xl font-semibold text-gray-600">+{files.length - 2}</span>
                          <span className="text-xs text-gray-500 mt-1">Voir plus</span>
                        </div>
                      )}

                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className="aspect-square rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:border-gray-400 hover:bg-gray-100 transition-colors"
                      >
                        <Plus className="w-8 h-8 text-gray-400" />
                      </div>
                    </div>
                  )}
                  <Input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept=".jpg,.jpeg,.png,.pdf"
                    onChange={(e) => {
                      const newFiles = Array.from(e.target.files ?? []);
                      if (newFiles.length > 0) {
                        addFiles(newFiles);
                        // Reset input to allow selecting the same file again
                        e.target.value = "";
                      }
                    }}
                    className="hidden"
                  />
                </div>

                {/* Modal */}
                {showModal && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-4xl w-full max-h-[80vh] overflow-hidden flex flex-col">
                      <div className="flex items-center justify-between p-6 border-b">
                        <h2 className="text-xl font-semibold text-gray-800">Tous les fichiers ({files.length})</h2>
                        <Button
                          type="button"
                          onClick={() => setShowModal(false)}
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
                              <Button
                                type="button"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  removeFile(index);
                                }}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-600"
                              >
                                <X className="w-4 h-4" />
                              </Button>
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

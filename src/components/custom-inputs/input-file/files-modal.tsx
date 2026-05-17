"use client";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import FileCard, { FileOrDocument } from "./file-card";
import { useTranslations } from "next-intl";
import { TRANSLATIONS_KEYS_2 } from "@/i18n/translation-keys";

interface FilesModalProps {
  files: FileOrDocument[];
  isOpen: boolean;
  disabled: boolean;
  onClose: () => void;
  onRemove: (index: number) => void;
}

export default function FilesModal({ files, isOpen, disabled, onClose, onRemove }: FilesModalProps) {
  const translation = useTranslations();

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg max-w-4xl w-full max-h-[80vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="files-modal-title"
      >
        <div className="flex items-center justify-between p-6 border-b">
          <h2 id="files-modal-title" className="text-xl font-semibold text-gray-800">
            {translation(TRANSLATIONS_KEYS_2.COMMON.BUTTONS.ADD, { count: files.length })}
          </h2>
          <Button
            type="button"
            onClick={onClose}
            variant="ghost"
            className="text-gray-500 hover:text-gray-700 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-6 h-6" />
          </Button>
        </div>
        <div className="p-6 overflow-y-auto">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {files.map((file, index) => (
              <div key={index}>
                <FileCard file={file} index={index} onRemove={onRemove} disabled={disabled} showFilename />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
"use client";
import { useState } from "react";

interface ValidationOptions {
  maxFileSize: number;
  maxFiles?: number;
}

export function useFileValidation({ maxFileSize, maxFiles }: ValidationOptions) {
  const [error, setError] = useState<string | null>(null);

  const validateFiles = (newFiles: File[], currentFiles: File[]): { valid: boolean; error?: string } => {
    // Check file size
    for (const file of newFiles) {
      if (file.size > maxFileSize * 1024 * 1024) {
        const errorMessage = `Le fichier "${file.name}" dépasse la taille maximale de ${maxFileSize}MB`;
        setError(errorMessage);
        return { valid: false, error: errorMessage };
      }
    }

    // Check max files limit
    if (maxFiles && currentFiles.length + newFiles.length > maxFiles) {
      const errorMessage = `Vous ne pouvez télécharger que ${maxFiles} fichier${maxFiles > 1 ? "s" : ""} maximum`;
      setError(errorMessage);
      return { valid: false, error: errorMessage };
    }

    setError(null);
    return { valid: true };
  };

  const clearError = () => setError(null);

  return { error, validateFiles, clearError, setError };
}

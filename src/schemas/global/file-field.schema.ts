import { z } from "zod";

type FileValidationOptions = {
    maxSize: number;
    acceptedTypes: string[];
    minFiles?: number;
    maxFiles?: number;
    requiredMessage?: string;
    sizeMessage?: string;
    typeMessage?: string;
};

export const inputFilesValidation = ({
    maxSize,
    acceptedTypes,
    minFiles,
    maxFiles,
    requiredMessage = "Au moins un fichier est requis",
    sizeMessage = "Chaque fichier doit être de taille valide",
    typeMessage = "Type de fichier non autorisé",
}: FileValidationOptions) => {
    let schema = z.array(z.instanceof(File));

    if (minFiles !== undefined) {
        schema = schema.min(minFiles, requiredMessage);
    }

    if (maxFiles !== undefined) {
        schema = schema.max(maxFiles, `Vous pouvez envoyer au maximum ${maxFiles} fichiers`);
    }

    return schema
        .refine((files) => files.every((file) => file.size <= maxSize), {
            message: sizeMessage,
        })
        .refine((files) => files.every((file) => acceptedTypes.includes(file.type)), {
            message: typeMessage,
        });
};
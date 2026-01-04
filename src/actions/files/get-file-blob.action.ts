"use server";

import { FileBlob } from "@/schemas/file/file-blob.schema";
import { FileService } from "@/services/file.service";

export async function getFileBlob(fileId: string): Promise<FileBlob | null> {
  try {
    return await FileService.getFileBlob(fileId);
  } catch (error) {
    console.log(error);
    return null;
  }
}

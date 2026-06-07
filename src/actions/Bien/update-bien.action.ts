"use server";
import { FormState } from "@/lib/definitions";
import { BienService } from "@/services/bien.service";
import { BienForm } from "@/schemas/biens/bien-form.schema";
import { handleServerActionError } from "@/lib/server.helper";

export async function updateBienAction(data: BienForm, id: string): Promise<FormState> {
  try {
    const formData = new FormData();

    for (const key in data) {
      if (key === "new_images" || key === "new_documents") {
        const files = (data as any)[key] as File[];
        files.forEach((file: File, index: number) => {
          formData.append(`${key}[${index}]`, file);
        });
        continue;
      }
      if (key === "deleted_images" || key === "deleted_documents") {
        const uuids = (data as any)[key] as string[];
        uuids.forEach((uuid: string, index: number) => {
          formData.append(`${key}[${index}]`, uuid);
        });
        continue;
      }
      if (key === "characteristics") {
        const characteristics = (data as any)[key] as number[];
        characteristics.forEach((characteristic: number, index: number) => {
          formData.append(`${key}[${index}]`, characteristic.toString());
        });
        continue;
      }
      if ((data as any)[key] instanceof Date) {
        formData.append(key, (data as any)[key].toISOString());
        continue;
      }

      if (typeof (data as any)[key] === "boolean") {
        formData.append(key, (data as any)[key] ? "1" : "0");
        continue;
      }

      const value = (data as any)[key];
      if (value === null || value === undefined || value === "") {
        continue;
      }
      formData.append(key, value);
    }

    await BienService.update(formData, id);
    return {
      isOk: true,
    };
  } catch (error) {

    const result = await handleServerActionError(error);
    return {
      isOk: false,
      errorMessage: result.errorMessage,
      errorCode: result.errorCode,
    };
  }
}

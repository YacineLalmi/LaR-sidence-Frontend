"use server";

import { FormState } from "@/lib/definitions";
import { handleServerActionError } from "@/lib/server.helper";
import { ClientForm } from "@/schemas/clients/client-form.schema";
import { ClientService } from "@/services/client.service";

export async function updateClientAction(data: ClientForm, id: string): Promise<FormState> {
  try {

    const formData = new FormData();
    for (const key in data) {
      if (key === "new_documents") {
        const files = (data as any)[key] as File[];
        files.forEach((file: File, index: number) => {
          formData.append(`${key}[${index}]`, file);
        });
        continue;
      }
      if (key === "deleted_documents") {
        const uuids = (data as any)[key] as string[];
        uuids.forEach((uuid: string, index: number) => {
          formData.append(`${key}[${index}]`, uuid);
        });
        continue;
      }

      if (key === "phone_numbers") {
        const phoneNumbers = (data as any)[key];
        phoneNumbers.forEach((phoneNumber: string, index: number) => {
          formData.append(`${key}[${index}]`, phoneNumber);
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
      if (value === null || value === undefined) {
        continue;
      }

      formData.append(key, value);
    }

    await ClientService.update(formData, id);
    return { isOk: true };
  } catch (error) {
    const result = await handleServerActionError(error);
    return {
      isOk: false,
      ...result,
    };
  }
}

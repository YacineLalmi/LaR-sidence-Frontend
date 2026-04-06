"use server";

import { FormState } from "@/lib/definitions";
import { handleServerActionError } from "@/lib/server.helper";
import { WilayaService } from "@/services/wilaya.service";

export async function deleteWilayasAction(ids: string[]): Promise<FormState> {
    try {
        await WilayaService.deleteMany(ids);
        return { isOk: true };
    } catch (error) {
        const result = await handleServerActionError(error);
        return {
            isOk: false,
            ...result,
        };
    }
}

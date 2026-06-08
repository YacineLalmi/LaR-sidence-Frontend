"use server"

import { FormState, QueryParams } from "@/lib/definitions";
import { Bien } from "@/schemas/biens/bien.schema";
import { BienService } from "@/services/bien.service";

export default async function getBienDetailsAction(id: string, queryParams?: QueryParams): Promise<FormState<Bien>> {

    try {
        const bien = await BienService.findOne(id, queryParams);
        return {
            data: bien,
            isOk: true,
        };
    } catch (error) {
        console.error("Error fetching bien details:", error);
        return {
            isOk: false,
        };
    }
}
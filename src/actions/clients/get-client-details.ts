"use server"

import { FormState, QueryParams } from "@/lib/definitions";
import { Client } from "@/schemas/clients/client.schema";
import { ClientService } from "@/services/client.service";

export default async function getClientDetailsAction(id: string, queryParams?: QueryParams): Promise<FormState<Client>> {

    try {
        const Client = await ClientService.findOne(id, queryParams);
        return {
            data: Client,
            isOk: true,
        };
    } catch (error) {
        console.error("Error fetching Client details:", error);
        return {
            isOk: false,
        };
    }
}
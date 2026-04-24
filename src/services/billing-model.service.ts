import ApiService from "./api.service";
import { PaginatedResponse, QueryParams } from "@/lib/definitions";
import { validateResponseData } from "@/lib/utils";
import { BillingModelForm } from "@/schemas/bills/models/billing-model-form.schema";
import { BillingModel, BillingModelSchema } from "@/schemas/bills/models/billing-model.schema";
import { ListItem, ListItemSchema } from "@/schemas/global.schema";
import z from "zod";

const END_POINTS = {
    create: "/configurations/bills/models",
    findMany: "/configurations/bills/models",
    list: "/lists/bills/models",
    findOne: (id: string) => `/configurations/bills/models/${id}`,
    update: (id: string) => `/configurations/bills/models/${id}`,
    delete: (id: string) => `/configurations/bills/models/${id}`,
    deleteMany: "/configurations/bills/models/many",
};

export const BillingModelService = {
    create: async (data: BillingModelForm) => {
        const response = await ApiService.post<BillingModel>({
            endpoint: END_POINTS.create,
            body: data,
        });

        const validatedResponseData = validateResponseData<BillingModel>(response.data, BillingModelSchema);

        return validatedResponseData;
    },

    findMany: async (QueryParams: QueryParams): Promise<PaginatedResponse<BillingModel>> => {
        const response = await ApiService.get<BillingModel[]>({
            endpoint: END_POINTS.findMany,
            query: QueryParams,
        });

        console.log(response)

        const validatedResponseData = validateResponseData<BillingModel[]>(response.data, z.array(BillingModelSchema));

        return {
            data: validatedResponseData,
            meta: response.meta,
        };
    },

    list: async (needle: string): Promise<ListItem[]> => {
        const response = await ApiService.get<ListItem[]>({
            endpoint: END_POINTS.list,
            query: { needle },
        });

        const validatedResponseData = validateResponseData<ListItem[]>(response.data, z.array(ListItemSchema));

        return validatedResponseData;
    },

    findOne: async (id: string) => {
        const response = await ApiService.get<BillingModel>({
            endpoint: END_POINTS.findOne(id),
        });

        const validatedResponseData = validateResponseData<BillingModel>(response.data, BillingModelSchema);

        return validatedResponseData;
    },

    update: async (data: BillingModelForm, id: string) => {
        const response = await ApiService.put<BillingModel>({
            endpoint: END_POINTS.update(id),
            body: data,
        });

        const validatedResponseData = validateResponseData<BillingModel>(response.data, BillingModelSchema);

        return validatedResponseData;
    },

    delete: async (id: string) => {
        await ApiService.delete({
            endpoint: END_POINTS.delete(id),
        });
    },

    deleteMany: async (ids: string[]) => {
        await ApiService.delete({
            endpoint: END_POINTS.deleteMany,
            body: { ids },
        });
    },
};

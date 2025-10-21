import ApiService from "./api.service";
import { validateResponseData } from "@/lib/utils";
import { ListItem, ListItemSchema } from "@/schemas/Global.schema";
import z from "zod";

const END_POINTS = {
  list: (id: string) => `/lists/wilayas/${id}/communes`,
};

export const CommunesService = {
  list: async (id: string) => {
    const response = await ApiService.get<ListItem[]>({
      endpoint: END_POINTS.list(id),
    });

    console.log("response", response);
    const validatedResponseData = validateResponseData<ListItem[]>(response.data, z.array(ListItemSchema));
    console.log("parsed", validatedResponseData);

    return validatedResponseData;
  },
};

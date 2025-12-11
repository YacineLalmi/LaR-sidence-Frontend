"use server";
import { FormState } from "@/lib/definitions";
import { BienService } from "@/services/Bien.service";
import { handleServerActionError } from "@/lib/utils";
import { BienForm } from "@/schemas/biens/bien-form.schema";

export async function createBienAction(data: BienForm): Promise<FormState> {
  try {
    // Transform string IDs to integers for backend compatibility
    const transformedData: any = {
      ...data,
      bien_type_id: parseInt(data.bien_type_id),
      transaction_type_id: parseInt(data.transaction_type_id),
      status_id: parseInt(data.status_id),
      agent_id: data.agent_id ? parseInt(data.agent_id) : null,
      wilaya_id: parseInt(data.wilaya_id),
      commune_id: parseInt(data.commune_id),
      postal_code: data.postal_code || "",
      // Convert dates to ISO strings (format: YYYY-MM-DD for date fields)
      availability_date: data.availability_date instanceof Date 
        ? data.availability_date.toISOString().split('T')[0] 
        : data.availability_date,
      exclusivity_start: data.exclusivity_start instanceof Date 
        ? data.exclusivity_start.toISOString().split('T')[0] 
        : data.exclusivity_start,
      exclusivity_end: data.exclusivity_end instanceof Date 
        ? data.exclusivity_end.toISOString().split('T')[0] 
        : data.exclusivity_end,
    };

    // Remove undefined/null values for optional fields
    if (!transformedData.monthly_charges) delete transformedData.monthly_charges;
    if (!transformedData.description) delete transformedData.description;
    if (!transformedData.comment) delete transformedData.comment;
    if (!transformedData.coordinates) delete transformedData.coordinates;
    if (!transformedData.agent_id) delete transformedData.agent_id;
    
    await BienService.create(transformedData);
    return {
      isOk: true,
    };
  } catch (error) {
    console.error("Create bien error:", error);
    const result = handleServerActionError(error);
    return {
      isOk: false,
      errorMessage: result.errorMessage,
      errorCode: result.errorCode,
    };
  }
}

"use server";
import { ApiResponseError } from "@/lib/utils";
import { ErrorCodes } from "@/lib/constants";
import { FormState } from "@/lib/definitions";
import { BienService } from "@/services/Bien.service";
import { BienSchema, CreateBien } from "@/schemas/Bien.schema";

export type CreateBienState = FormState & CreateBien;

export async function createBienAction(initialState: CreateBienState, formData: FormData): Promise<CreateBienState> {
  // Extract fields from formData
  const title = formData.get("title") as string;
  const adresse = formData.get("adresse") as string;
  const wilaya = formData.get("wilaya") as string;
  const commune = formData.get("commune") as string;
  const habitable_surface = Number(formData.get("habitable_surface"));
  const total_surface = Number(formData.get("total_surface"));
  const peices = Number(formData.get("peices"));
  const rooms = Number(formData.get("rooms"));
  const price = Number(formData.get("price"));
  const exclusivity = formData.get("exclusivity") === "on" || formData.get("exclusivity") === "true";
  const exclusivity_start = formData.get("exclusivity_start") as string;
  const exclusivity_end = formData.get("exclusivity_end") as string;
  const responsible_agent = formData.get("responsible_agent") as string;

  const validatedFields = BienSchema.omit({ id: true, created_at: true, updated_at: true, deleted_at: true }).safeParse(
    {
      title,
      adresse,
      wilaya,
      commune,
      habitable_surface,
      total_surface,
      peices,
      rooms,
      price,
      exclusivity,
      exclusivity_start,
      exclusivity_end,
      responsible_agent,
    }
  );

  if (!validatedFields.success) {
    return {
      title,
      adresse,
      wilaya,
      commune,
      habitable_surface,
      total_surface,
      peices,
      rooms,
      price,
      exclusivity,
      exclusivity_start: new Date(exclusivity_start),
      exclusivity_end: new Date(exclusivity_start),
      responsible_agent,
      isOk: "NOK",
      errorMessage: "Validation Error",
      errorCode: ErrorCodes.VALIDATION_ERROR,
      errorDetails: {
        title: validatedFields.error?.flatten().fieldErrors.title?.[0] || "",
        adresse: validatedFields.error?.flatten().fieldErrors.adresse?.[0] || "",
        wilaya: validatedFields.error?.flatten().fieldErrors.wilaya?.[0] || "",
        commune: validatedFields.error?.flatten().fieldErrors.commune?.[0] || "",
        habitable_surface: validatedFields.error?.flatten().fieldErrors.habitable_surface?.[0] || "",
        total_surface: validatedFields.error?.flatten().fieldErrors.total_surface?.[0] || "",
        peices: validatedFields.error?.flatten().fieldErrors.peices?.[0] || "",
        rooms: validatedFields.error?.flatten().fieldErrors.rooms?.[0] || "",
        price: validatedFields.error?.flatten().fieldErrors.price?.[0] || "",
        exclusivity: validatedFields.error?.flatten().fieldErrors.exclusivity?.[0] || "",
        exclusivity_start: validatedFields.error?.flatten().fieldErrors.exclusivity_start?.[0] || "",
        exclusivity_end: validatedFields.error?.flatten().fieldErrors.exclusivity_end?.[0] || "",
        responsible_agent: validatedFields.error?.flatten().fieldErrors.responsible_agent?.[0] || "",
      },
    };
  }

  try {
    await BienService.create({
      title,
      adresse,
      wilaya,
      commune,
      habitable_surface,
      total_surface,
      peices,
      rooms,
      price,
      exclusivity,
      exclusivity_start: new Date(exclusivity_start),
      exclusivity_end: new Date(exclusivity_start),
      responsible_agent,
    });
    return {
      title,
      adresse,
      wilaya,
      commune,
      habitable_surface,
      total_surface,
      peices,
      rooms,
      price,
      exclusivity,
      exclusivity_start: new Date(exclusivity_start),
      exclusivity_end: new Date(exclusivity_start),
      responsible_agent,
      isOk: "OK",
    };
  } catch (error) {
    if (error instanceof ApiResponseError) {
      return {
        title,
        adresse,
        wilaya,
        commune,
        habitable_surface,
        total_surface,
        peices,
        rooms,
        price,
        exclusivity,
        exclusivity_start: new Date(exclusivity_start),
        exclusivity_end: new Date(exclusivity_start),
        responsible_agent,
        isOk: "NOK",
        errorMessage: error.error,
        errorCode: ErrorCodes.UKNOWN_ERROR,
      };
    }
    return {
      title,
      adresse,
      wilaya,
      commune,
      habitable_surface,
      total_surface,
      peices,
      rooms,
      price,
      exclusivity,
      exclusivity_start: new Date(exclusivity_start),
      exclusivity_end: new Date(exclusivity_start),
      responsible_agent,
      isOk: "NOK",
      errorCode: ErrorCodes.UKNOWN_ERROR,
      errorMessage: "Something went wrong",
    };
  }
}

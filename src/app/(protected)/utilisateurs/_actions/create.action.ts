"use server";
import { ApiResponseError } from "@/lib/utils";
import { ErrorCodes } from "@/lib/constants";
import { FormState } from "@/lib/definitions";
import { CreateOrUpdateUser, CreateOrUpdateUserSchema } from "@/schemas/utilisateur.schema";
import { UserService } from "@/services/utilisateur.service";

export type CreateUserState = FormState & CreateOrUpdateUser;

export async function createAction(initialState: CreateUserState, formData: FormData): Promise<CreateUserState> {
  const nom = formData.get("nom") as string;
  const prenom = formData.get("prenom") as string;
  const nom_utilisateur = formData.get("nom_utilisateur") as string;
  const est_active = Boolean(formData.get("est_active") as string);

  const validatedFields = CreateOrUpdateUserSchema.safeParse({
    nom,
    prenom,
    nom_utilisateur,
    est_active,
  });

  if (!validatedFields.success) {
    return {
      nom,
      prenom,
      nom_utilisateur,
      est_active,
      isOk: "NOK",
      errorMessage: "Validation Error", // TODO Change with i18n
      errorCode: ErrorCodes.VALIDATION_ERROR,
      errorDetails: {
        nom: validatedFields.error?.flatten().fieldErrors.nom?.[0] || "",
        nom_utilisateur: validatedFields.error?.flatten().fieldErrors.nom_utilisateur?.[0] || "",
        est_active: validatedFields.error?.flatten().fieldErrors.est_active?.[0] || "",
      },
    };
  }

  try {
    const response = await UserService.create({
      nom,
      prenom,
      nom_utilisateur,
      est_active,
    });

    return {
      nom,
      prenom,
      nom_utilisateur,
      est_active,
      isOk: "OK",
    };
  } catch (error) {
    if (error instanceof ApiResponseError) {
      return {
        nom,
        prenom,
        nom_utilisateur,
        est_active,
        isOk: "NOK",
        errorMessage: error.message,
        errorCode: ErrorCodes.UKNOWN_ERROR,
      };
    }
    return {
      nom,
      prenom,
      nom_utilisateur,
      est_active,
      isOk: "NOK",
      errorCode: ErrorCodes.UKNOWN_ERROR,
      errorMessage: "Something went wrong from login",
    };
  }
}

"use server";

import { ApiResponseError, setCookie } from "@/lib/utils";
import { ErrorCodes } from "@/lib/constants";
import { FormState } from "@/lib/definitions";
import { LoginRequestData, LoginRequestDataSchema } from "@/schemas/auth.schema";
import { authService } from "@/services/auth.service";
import { differenceInSeconds } from "date-fns";

export type LoginState = FormState & LoginRequestData;

export async function login(initialState: LoginState, formData: FormData): Promise<LoginState> {
  const nom_utilisateur = formData.get("nom_utilisateur") as string;
  const mot_de_passe = formData.get("mot_de_passe") as string;

  const validatedFields = LoginRequestDataSchema.safeParse({
    nom_utilisateur,
    mot_de_passe,
  });

  if (!validatedFields.success) {
    return {
      nom_utilisateur,
      mot_de_passe,
      isOk: "NOK",
      errorMessage: "Validation Error", // TODO Change with i18n
      errorCode: ErrorCodes.VALIDATION_ERROR,
      errorDetails: {
        username: validatedFields.error?.flatten().fieldErrors.nom_utilisateur?.[0] || "",
        password: validatedFields.error?.flatten().fieldErrors.mot_de_passe?.[0] || "",
      },
    };
  }

  try {
    const response = await authService.login({ nom_utilisateur, mot_de_passe });
    await setCookie({
      key: "access_token",
      value: response.access_token,
      expires: differenceInSeconds(response.access_token_expires_at, new Date()),
      maxAge: differenceInSeconds(response.access_token_expires_at, new Date()),
    });

    return {
      nom_utilisateur,
      mot_de_passe,
      isOk: "OK",
    };
  } catch (error) {
    if (error instanceof ApiResponseError) {
      return {
        nom_utilisateur,
        mot_de_passe,
        isOk: "NOK",
        errorMessage: error.message,
        errorCode: ErrorCodes.UKNOWN_ERROR,
      };
    }
    console.error(error);
    return {
      nom_utilisateur,
      mot_de_passe,
      isOk: "NOK",
      errorCode: ErrorCodes.UKNOWN_ERROR,
      errorMessage: "Something went wrong from login",
    };
  }
}

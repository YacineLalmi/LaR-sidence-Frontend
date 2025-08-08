"use server";
import { ApiResponseError } from "@/lib/utils";
import { ErrorCodes } from "@/lib/constants";
import { FormState } from "@/lib/definitions";
import { UserService } from "@/services/users.service";
import { CreateOrUpdateUser, CreateOrUpdateUserSchema } from "@/schemas/user.schema";

export type CreateUtilisateurState = FormState & CreateOrUpdateUser;

export async function createUtilisateurAction(
  initialState: CreateUtilisateurState,
  formData: FormData
): Promise<CreateUtilisateurState> {
  const last_name = formData.get("last_name") as string;
  const first_name = formData.get("first_name") as string;
  const is_active = formData.get("is_active") === "on" || formData.get("est_active") === "true";
  const username = formData.get("username") as string;
  const email = formData.get("email") as string;

  const validatedFields = CreateOrUpdateUserSchema.safeParse({
    last_name,
    first_name,
    is_active,
    username,
    email,
  });

  if (!validatedFields.success) {
    return {
      last_name,
      first_name,
      is_active,
      username,
      email,
      isOk: "NOK",
      errorMessage: "Validation Error",
      errorCode: ErrorCodes.VALIDATION_ERROR,
      errorDetails: {
        last_name: validatedFields.error?.flatten().fieldErrors.last_name?.[0] || "",
        first_name: validatedFields.error?.flatten().fieldErrors.first_name?.[0] || "",
        is_active: validatedFields.error?.flatten().fieldErrors.is_active?.[0] || "",
        username: validatedFields.error?.flatten().fieldErrors.username?.[0] || "",
        email: validatedFields.error?.flatten().fieldErrors.email?.[0] || "",
      },
    };
  }

  try {
    await UserService.create({ last_name, first_name, is_active, username, email });
    return { last_name, first_name, is_active, username, email, isOk: "OK" };
  } catch (error) {
    if (error instanceof ApiResponseError) {
      return {
        last_name,
        first_name,
        is_active,
        username,
        email,
        isOk: "NOK",
        errorMessage: error.error,
        errorCode: ErrorCodes.UKNOWN_ERROR,
      };
    }
    return {
      last_name,
      first_name,
      is_active,
      username,
      email,
      isOk: "NOK",
      errorCode: ErrorCodes.UKNOWN_ERROR,
      errorMessage: "Something went wrong",
    };
  }
}

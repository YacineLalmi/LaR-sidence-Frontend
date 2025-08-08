"use server";

import { setCookie, UnauthorizedError, ValidationError } from "@/lib/utils";
import { ErrorCodes } from "@/lib/constants";
import { FormState } from "@/lib/definitions";
import { authService } from "@/services/auth.service";
import { differenceInSeconds } from "date-fns";
import { LoginForm, LoginFormSchema } from "@/schemas/auth.schema";

export interface LoginState {
  form: FormState;
  data: LoginForm;
}

export async function login(initialState: LoginState, formData: FormData): Promise<LoginState> {
  const data: LoginForm = {
    username: formData.get("username") as string,
    password: formData.get("password") as string,
  };

  let form = initialState.form;

  const validatedFields = LoginFormSchema.safeParse(data);

  if (!validatedFields.success) {
    form = {
      isOk: "NOK",
      errorMessage: "Validation Error",
      errorCode: ErrorCodes.VALIDATION_ERROR,
      errorDetails: validatedFields.error?.flatten().fieldErrors,
    };
    return {
      data,
      form: form,
    };
  }

  try {
    const response = await authService.login(data);
    await setCookie({
      key: "access_token",
      value: response.access_token,
      expires: differenceInSeconds(response.access_token_expires_at, new Date()),
      maxAge: differenceInSeconds(response.access_token_expires_at, new Date()),
    });

    await setCookie({
      key: "refresh_token",
      value: response.refresh_token,
      expires: differenceInSeconds(response.refresh_token_expires_at, new Date()),
      maxAge: differenceInSeconds(response.refresh_token_expires_at, new Date()),
    });

    form.isOk = "OK";
    return {
      data,
      form: form,
    };
  } catch (error) {
    console.log("form", form);
    form.isOk = "NOK";
    if (error instanceof ValidationError) {
      form.errorMessage = error.message;
      form.errorCode = ErrorCodes.VALIDATION_ERROR;
      return {
        data,
        form: form,
      };
    } else {
      throw error;
    }
  }
}

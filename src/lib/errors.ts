import { ErrorCodes } from "./constants";

export class UnauthorizedError extends Error {
  constructor(message: string = "You are not authorized to perform this action.") {
    super(message);
    this.name = ErrorCodes.UNAUTHORIZED;
  }
}

export class ForbiddenError extends Error {
  constructor(message: string = "Access to this resource is forbidden.") {
    super(message);
    this.name = ErrorCodes.FORBIDDEN;
  }
}

export class ResponseValidationError extends Error {
  constructor(message: string = "The provided data is invalid.") {
    super(message);
    this.name = ErrorCodes.RESPONSE_VALIDATION_ERROR;
  }
}

export class FormValidationError extends Error {
  constructor(message: string = "The provided data is invalid.") {
    super(message);
    this.name = ErrorCodes.FORM_VALIDATION_ERROR;
  }
}

export class ServerError extends Error {
  constructor(message: string = "An internal server error occurred. Please try again later.") {
    super(message);
    this.name = ErrorCodes.SERVER_ERROR;
  }
}

export class NotFoundError extends Error {
  constructor(message: string = "The requested resource was not found.") {
    super(message);
    this.name = ErrorCodes.RESOURCE_NOT_FOUND;
  }
}

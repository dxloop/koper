import { HttpStatusCode } from "axios";
import { ServiceError, restErrorCodes } from "openapi";

/**
 * Creates a WebserviceException for missing authentication with status code 401 (jwt token missing or invalid)
 * @returns a ServiceError with status code 401
 */
export function notAuthenticated(): ServiceError {
    return {
        status: HttpStatusCode.Unauthorized,
        code: restErrorCodes.NOT_AUTHENTICATED,
        message: "Missing authentication token"
    }
}
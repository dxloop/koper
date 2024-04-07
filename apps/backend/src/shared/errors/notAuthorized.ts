import { HttpStatusCode } from "axios";
import { RestResources, ServiceError, restErrorCodes } from "openapi";

/**
 * Creates a WebserviceException for missing authorization with status code 401
 * @param resource - the resource that caused the error
 * @returns a ServiceError with status code 401
 */
export function notAuthorized(resource: RestResources): ServiceError {
    return {
        status: HttpStatusCode.Unauthorized,
        code: restErrorCodes.PERMISSION_DENIED,
        message: `You are not authorized to access ${resource}`
    }
}
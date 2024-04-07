import { HttpStatusCode } from "axios";
import { RestResources, ServiceError, restErrorCodes } from "openapi";

/**
 * The error message for an invalid body
 * @param resource - the resource that caused the error
 * @param details - additional details about the error
 * @returns a ServiceError with status code 400
 */
export function invalidBody(resource: RestResources, details?: string): ServiceError {
    return {
        status: HttpStatusCode.BadRequest,
        code: restErrorCodes.BAD_REQUEST,
        message: `Invalid body for ${resource}`,
        details
    }
}
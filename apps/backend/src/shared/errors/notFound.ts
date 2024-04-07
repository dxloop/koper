import { HttpStatusCode } from "axios";
import { RestResources, ServiceError, restErrorCodes } from "openapi";

/**
 * Creates a WebServiceException with status code 404, if a resource is not found.
 * @param resource - the resource that caused the error
 * @param details - additional details about the error
 * @returns a ServiceError with status code 404
 */
export function notFound(resource: RestResources, details?: string): ServiceError {
    return {
        status: HttpStatusCode.NotFound,
        code: restErrorCodes.NOT_FOUND,
        message: `The ${resource} was not found`,
        details
    }
}
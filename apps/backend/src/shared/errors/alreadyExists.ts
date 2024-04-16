import { HttpStatusCode } from "axios"
import { RestResources, ServiceError, restErrorCodes } from "openapi"

/**
 * Creates a WebServiceException with status code 409
 * @param resource - the name of the resource that already exists
 * @param details - additional details about the error
 * @returns a ServiceError with status code 409
 */
export function alreadyExists(resource: RestResources, details?: string): ServiceError {
	return {
		status: HttpStatusCode.Conflict,
		code: restErrorCodes.ALREADY_EXISTS,
		message: `The ${resource} already exists`,
		details
	}
}

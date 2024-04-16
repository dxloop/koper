import { HttpStatusCode } from "axios"
import { RestResources, ServiceError, restErrorCodes, RestActions } from "openapi"

/**
 * Creates a WebServiceException with status code 500
 * @param action - the action that caused the error
 * @param resource - the resource that caused the error
 * @param details - additional details about the error
 * @returns a ServiceError with status code 500
 */
export function internalError(action: RestActions, resource: RestResources, details?: string): ServiceError {
	return {
		status: HttpStatusCode.InternalServerError,
		code: restErrorCodes.INTERNAL_SERVER_ERROR,
		message: `An internal error occurred while processing the ${action} on ${resource}`,
		details
	}
}

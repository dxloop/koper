import { ServiceError } from "openapi";
import { Response } from "express";


// @TODO Stricter type check, which checks if response has ServiceError as error return type
/**
 * Sends the response with the given error
 * @param res - the response object
 * @param error - the service error to send
 * @returns a promise once the response has been sent
 */
export function rejectWithError(res: Response, error: ServiceError) {
    return res.status(error.status).send(error)
}
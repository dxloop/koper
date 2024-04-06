/**
 * Creates a WebserviceException for missing authentication with status code 401 (jwt token missing or invalid)
 */
export function notAuthenticated() {
    throw new Error("Function not implemented.");
}
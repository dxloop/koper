import { UserWithJwt, RequestConfig } from "openapi"

/**
 * Authorization data used for generating the auth header.
 */
type AuthorizationData = {
	/**
	 * Type of token to be included in the auth header (default is "Bearer").
	 */
	tokenType?: UserWithJwt["tokenType"]
	/**
	 * Access token to be included in the auth header.
	 */
	accessToken: UserWithJwt["token"]
}

/**
 * Generates an auth header with the specified token type and access token.
 *
 * @param authorizationData - Data for generating the auth header.
 * @returns The generated auth header string.
 */
export const authorizationHeader = ({ tokenType = "Bearer", accessToken }: AuthorizationData) => {
	return [tokenType, accessToken].join(" ")
}

/**
 * Request configuration object with the auth header.
 *
 * @param authorizationData - Data used to generate the auth header.
 * @returns Request configuration object with the Auth header.
 */
export const requestConfig = (authorizationData: AuthorizationData): Partial<RequestConfig> => {
	return {
		headers: {
			Authorization: authorizationHeader(authorizationData)
		}
	}
}

export default requestConfig

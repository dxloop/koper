import { WithZodiosContext, ZodiosRouterContextRequestHandler } from "@zodios/express"
import { Request } from "express"
import { decodeAndVerifyToken } from "./jwt.js"
import { contextSchema } from "./userContext.js"

/**
 * Retrieves the user token from the request headers if available.
 *
 * @param req - Request object with Zodios context.
 * @returns The decoded user token if found, otherwise null.
 */
const getUserToken = async (req: WithZodiosContext<Request, typeof contextSchema>) => {
	const authorization = req.headers.authorization
	if (authorization === undefined) return null

	const token = authorization.split(" ")[1]
	if (token === undefined) return null

	return decodeAndVerifyToken(token).then((result) => {
		return result
	}).catch(() => {
		return null
	});
}

/**
 * Handle user authentication and attach user data to the request with the user middleware.
 *
 * Retrieves the user token from the request headers and validates it.
 * If successful, it attaches the user data to the request object for further processing.
 *
 * @param req - Request object with Zodios context.
 * @param res - Response object for handling authentication errors.
 * @param next - The next middleware function.
 */
const userMiddleware: ZodiosRouterContextRequestHandler<typeof contextSchema> = async (req, res, next) => {
	const userToken = await getUserToken(req)
	contextSchema.parseAsync({ user: userToken !== null ? userToken.payload : null }).then((result) => {
        req.user = result.user
    }).catch((error) => {
        res.status(401).json({ error: error.message })
    })

	next() // Proceed to the next request
}

export default userMiddleware

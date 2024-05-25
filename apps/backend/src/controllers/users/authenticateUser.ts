import { restActions, restResources } from "openapi"
import { compare } from "bcrypt"
import { PEPPER } from "../../config/config.js"
import Handler from "../../zodios/requestHandler.js"
import { getUserWithEmail } from "../../repositories/users/getUser.js"
import { generateToken } from "../../auth/jwt.js"
import { rejectWithError } from "../../shared/errors/rejectWithError.js"
import { notAuthorized } from "../../shared/errors/notAuthorized.js"
import { notFound } from "../../shared/errors/notFound.js"
import { internalError } from "../../shared/errors/internalError.js"
import { transformUser } from "../../transformers/user.js"

/**
 * Authenticate a user.
 *
 * @param req - The Express request object.
 * @param res - The Express response object.
 */
const authenticateUser: Handler<"post", "/users/login"> = async (req, res) => {
	const { email, password } = req.body

	// Get user by email
	const user = await getUserWithEmail(email).catch(() => null)
	if (user === null) {
		return rejectWithError(res, notFound(restResources.User, "No user with this email found"))
	}

	// Compare passwords
	const isPasswordValid = await compare(password + PEPPER, user.password)
	if (!isPasswordValid) {
		return rejectWithError(res, notAuthorized(restResources.User))
	}

	// Generate JWT Token
	const accessToken = await generateToken({ id: user.id.toString() }).catch(() => null)
	if (accessToken === null) {
		return rejectWithError(res, internalError(restActions.Create, restResources.User, "Could not generate token"))
	}

	return res.status(200).send({
		...transformUser(user),
		token: accessToken,
		tokenType: "Bearer"
	})
}

export default authenticateUser
